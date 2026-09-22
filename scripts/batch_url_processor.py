import sys
import os
import re
import json
import ssl
import time
import subprocess
import datetime
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
        sys.stderr.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DETAILS_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobDetails.json')
JOBS_DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobsData.ts')
UPLOAD_DATES_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobUploadDates.json')
URLS_FILE = os.path.join(PROJECT_ROOT, 'scripts', 'urls_to_process.json')
PROGRESS_FILE = os.path.join(PROJECT_ROOT, 'scratch', 'batch_progress.json')
GIT_PATH = r"C:\Users\Administrator\MinGit\cmd\git.exe" if os.name == 'nt' else "git"
NPM_CMD = "npm.cmd" if os.name == 'nt' else "npm"
NPX_CMD = "npx.cmd" if os.name == 'nt' else "npx"

if os.path.exists(URLS_FILE):
    with open(URLS_FILE, 'r', encoding='utf-8-sig') as f:
        INPUT_URLS = json.load(f)
else:
    INPUT_URLS = []

MONTHS_MAP = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September'
}

def clean_text(text):
    if not text:
        return ""
    if isinstance(text, list):
        text = " | ".join(str(item) for item in text if item)
    elif not isinstance(text, str):
        text = str(text)
    text = text.replace('\xa0', ' ').replace('\u2013', '-').replace('\u2014', '-').replace('\ufffd', ' ')
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

BOARD_ACRONYM_MAP = {
    'staff selection commission': 'ssc',
    'union public service commission': 'upsc',
    'railway recruitment board': 'rrb',
    'uttarakhand subordinate service selection commission': 'uksssc',
    'tamil nadu public service commission': 'tnpsc',
    'andhra pradesh public service commission': 'appsc',
    'chhattisgarh public service commission': 'cgpsc',
    'mizoram public service commission': 'mpsc-mizoram',
    'delhi development authority': 'dda',
    'india optel': 'iol',
    'punjab agricultural university': 'pau',
    'junagadh agricultural university': 'jau',
    'punjabi university': 'punjabi-univ',
    'central university of punjab': 'cup',
    'guru angad dev veterinary': 'gadvasu',
    'gb pant university': 'gbpuat',
    'govind ballabh pant university': 'gbpuat',
    'central university of jharkhand': 'cuj',
    'central university of odisha': 'cuo',
    'aligarh muslim university': 'amu',
    'manipal academy of higher education': 'mahe',
    'mineral exploration corporation': 'mecl',
    'army public school': 'aps',
    'kendriya vidyalaya': 'kvs',
    'pm shri kendriya vidyalaya': 'kvs',
    'national health mission': 'nhm',
    'goa staff selection commission': 'goa-ssc',
    'government institute of medical sciences': 'gims',
    'tata memorial centre': 'tmc',
    'homi bhabha cancer hospital': 'hbchrc',
    'container corporation of india': 'concor',
    'subordinate services selection board punjab': 'psssb',
    'rajasthan staff selection board': 'rsmssb',
    'madhya pradesh employees selection board': 'mpesb',
    'national institute of technology': 'nit',
    'indian institute of technology': 'iit',
    'indian institute of management': 'iim',
    'indian institute of science': 'iisc',
    'all india institute of medical sciences': 'aiims',
    'institute of banking personnel selection': 'ibps',
    'indian institute of banking and finance': 'iibf',
    'defence research and development': 'drdo',
    'combat aircraft system development': 'casdic-drdo',
    'indian space research': 'isro',
    'isro propulsion complex': 'isro-iprc',
    'bharat electronics limited': 'bel',
    'bharat heavy electricals': 'bhel',
    'steel authority of india': 'sail',
    'oil and natural gas': 'ongc',
    'rites limited': 'rites',
    'rites': 'rites',
    'csir': 'csir',
    'icar': 'icar',
    'esic': 'esic',
    'delhi high court': 'delhi-hc',
    'high court of delhi': 'delhi-hc',
    'madhya pradesh high court': 'mp-hc',
    'vadodara mahanagar palika': 'vmc',
    'uttar pradesh subordinate services selection commission': 'upsssc',
    'district child protection unit': 'dcpu',
    'rajasthan university of health sciences': 'ruhs',
    'andaman & nicobar islands institute of medical sciences': 'aniims',
    'gayatri co-operative urban bank': 'gayatri-bank',
    'central power research institute': 'cpri',
    'bhavini': 'bhavini',
    'tamil nadu state forest': 'tnsffcc',
    'shri krishna ayush university': 'skau',
    'islamic university of science': 'iust',
    'kavayitri bahinabai chaudhari north maharashtra university': 'kbcnmu',
    'north eastern hill university': 'nehu',
    'utkal balashram': 'utkal-balashram',
    'kasturba gandhi balika vidyalaya': 'kgbv',
    'airports authority of india': 'aai',
    'state level police recruitment board': 'slprb',
    'andhra pradesh police': 'ap-police',
    'grid controller of india': 'grid-india',
    'west assam milk producers': 'wamul',
    'national institute of pharmaceutical education and research': 'niper',
    'export-import bank of india': 'exim-bank',
    'ai airport services': 'aiasl',
    'ai engineering services': 'aiesl',
    'national law university delhi': 'nlud',
    'echs': 'echs',
    'ex-servicemen contributory health scheme': 'echs',
    'dr. ram manohar lohia': 'drrmlims',
    'ram manohar lohia institute': 'drrmlims',
    'national highways authority of india': 'nhai',
    'engineers india limited': 'eil',
    'delhi transco limited': 'delhi-transco',
    'haryana state pollution control board': 'hspcb',
    'reserve bank of india': 'rbi',
    'central food technological research institute': 'csir-cftri',
    'microwave tube research & development establishment': 'drdo-mtrdc',
    'hindustan aeronautics': 'hal',
    'udupi cochin shipyard': 'ucsl',
    'cochin shipyard': 'csl',
    'national law institute university': 'nliu',
    'advanced centre for treatment': 'actrec',
    'defence institute of advanced technology': 'diat',
    'mahatma phule krishi vidyapeeth': 'mpkv',
    'odisha adarsha vidyalaya': 'oav',
    'district medical & health': 'dmho',
    'tribal development branch': 'tdb',
    'national centre for disease control': 'ncdc',
    'indira gandhi national open university': 'ignou',
    'grih kalyan kendra': 'gkk',
    'intelligent communication systems india': 'icsil',
    'rail land development authority': 'rlda',
    'ifci limited': 'ifci',
    'ifci': 'ifci',
    'deendayal port authority': 'dpa',
    'haryana public service commission': 'hpsc',
    'translational health science': 'thsti',
    'chaudhary charan singh haryana agricultural': 'ccshau',
    'wapcos limited': 'wapcos',
    'wapcos': 'wapcos',
    'himachal pradesh public service commission': 'hppsc',
    'naval physical and oceanographic laboratory': 'drdo-npol',
    'southern railway': 'sr',
    'calicut university': 'calicut-univ',
    'university of calicut': 'calicut-univ',
    'district court thrissur': 'dc-thrissur',
    'madhya pradesh bhoj open university': 'mpbou',
    'nepa limited': 'nepa',
    'bhopal memorial hospital': 'bmhrc',
    'madhya pradesh police': 'mp-police',
    'vehicles research and development establishment': 'drdo-vrde',
    'ordnance factory ambarnath': 'ofa',
    'mumbai port authority': 'mbpa',
    'khadi and village industries commission': 'kvic',
    'national film development corporation': 'nfdc',
    'maharashtra state electricity transmission': 'mahatransco',
    'central forensic science laboratory': 'cfsl',
    'directorate of health services south garo hills': 'dhs-sgh',
    'samagra shiksha jajpur': 'ss-jajpur',
    'government high school hatibari': 'ghs-hatibari',
    'zilla swasthya samiti': 'zss',
    'orissa university of agriculture and technology': 'ouat',
    'jawaharlal institute of postgraduate medical education': 'jipmer',
    'sainik school kapurthala': 'ss-kapurthala',
    'sainik school mainpuri': 'ss-mainpuri',
    'sainik school': 'sainik-school',
    'central university of rajasthan': 'curaj',
    'south zone cultural centre': 'szcc',
    'government medical college thiruvallur': 'gmc-thiruvallur',
    'tamil nadu veterinary and animal sciences university': 'tanuvas',
    'institute of mental health chennai': 'imh-chennai',
    'directorate of health services kanyakumari': 'dhs-kanyakumari',
    'district child welfare and special services': 'dcwss',
    'telangana public service commission': 'tgpsc',
    'society for agriculture and rural development': 'saird',
    'bits pilani': 'bits-pilani',
    'district hospital mancherial': 'dh-mancherial',
    'centre for materials for electronics technology': 'c-met',
    'rrc south central railway': 'rrc-scr',
    'south central railway': 'scr',
    'tripura natural gas company': 'tngcl',
    'chief medical officer ballia': 'cmo-ballia',
    'major dhyan chand sports university': 'mdcsu',
    'sanjay gandhi postgraduate institute': 'sgpgims',
    'dr. rammanohar lohia avadh university': 'rmlau',
    'district court prayagraj': 'dc-prayagraj',
    'kasturba gandhi balika vidyalaya agra': 'kgbv-agra',
    'indian institute of science education and research': 'iiser',
    'iiser kolkata': 'iiser-kolkata',
    'chittaranjan national cancer institute': 'cnci',
    'central glass and ceramic research institute': 'csir-cgcri',
    'district health & family welfare samiti': 'dhfws',
    'army public school bengdubi': 'aps-bengdubi',
    'bidhan chandra krishi viswavidyalaya': 'bckv',
    'telangana employment association': 'team',
    'east central railway': 'ecr',
    'national bureau of plant genetic resources': 'nbpgr',
    'gujarat metro rail': 'gmrc',
    'indian coast guard': 'icg',
    'jharkhand staff selection commission': 'jssc',
    'kuvempu university': 'kuvempu-univ',
    'karnataka state law university': 'kslu',
    'bharat earth movers': 'beml',
    'karnataka prisons': 'karnataka-prisons',
    'manganese ore india': 'moil',
    'institute of company secretaries of india': 'icsi',
    'munitions india': 'mil',
    'coimbatore medical college': 'cmch',
    'state bank of india': 'sbi',
    'district court sangareddy': 'dc-sangareddy',
    'sangareddy district court': 'dc-sangareddy',
    'up council of agricultural research': 'upcar',
    'hll infra tech services': 'hites',
    'cantonment board barrackpore': 'cb-barrackpore',
    'east godavari district': 'east-godavari',
    'indian institute of information technology': 'iiit',
    'delhi metro rail corporation': 'dmrc',
    'delhi metro': 'dmrc',
    'shipping corporation of india': 'sci',
    'tata institute of social sciences': 'tiss',
    'national legal services authority': 'nalsa',
    'district legal services authority': 'dlsa',
    'maulana azad institute of dental sciences': 'maids',
    'indo-tibetan border police': 'itbp',
    'indo tibetan border police': 'itbp',
    'centre for development of advanced computing': 'cdac',
    'center for development of advanced computing': 'cdac',
    'indian railway construction': 'ircon',
    'gujarat national law university': 'gnlu',
    'maharashtra national law university': 'mnlu',
    'national ayush mission': 'nam',
    'tamil nadu agricultural university': 'tnau',
    'national institute of animal biotechnology': 'niab',
    'rajiv gandhi institute of petroleum technology': 'rgipt',
    'indira gandhi rashtriya uran akademi': 'igrua',
    'hindustan copper limited': 'hcl',
    'hindustan copper': 'hcl',
    'sardar vallabhbhai patel hospital': 'svbph',
    'swami dayanand hospital': 'sddmasc',
    'poojya mata shri devki devi hospital': 'pmmmh',
    'poorva madhya railway': 'ecr',
    'central railway': 'cr',
    'national institute of electronics & information technology': 'nielit',
    'national institute of electronics and information technology': 'nielit',
    'indian institute of foreign trade': 'iift',
    'directorate of land records & surveys': 'dlrs',
    'directorate of land records and surveys': 'dlrs',
    'nabard financial services': 'nabfins',
    'repco bank': 'repco',
    'national book trust': 'nbt',
    'indian overseas bank': 'iob',
    'bank of india': 'boi',
    'acharya n.g. ranga agricultural university': 'angrau',
    'acharya ng ranga agricultural university': 'angrau',
    'central reserve police force': 'crpf',
    'bihar public service commission': 'bpsc',
    'delhi pharmaceutical sciences and research university': 'dpsru',
    'government e-marketplace': 'gem',
    'government e marketplace': 'gem',
    'press council of india': 'pci',
    'panjab university': 'pu',
    'postgraduate institute of medical education and research': 'pgimer',
    'post graduate institute of medical education and research': 'pgimer',
    'national health systems resource centre': 'nhsrc',
    'delhi jal board': 'djb',
    'vardhman mahavir medical college': 'vmmc',
    'safdarjung hospital': 'vmmc',
    'shri govind guru university': 'sggu',
    'sardarkrushinagar dantiwada agricultural university': 'sdau',
    'gujarat biotechnology university': 'gbu',
    'national institute of food technology entrepreneurship and management': 'niftem',
    'central university of haryana': 'cuh',
    'sree chitra tirunal institute': 'sctimst',
    'karnataka state pollution control board': 'kspcb',
    'indira gandhi national tribal university': 'igntu',
    'atal bihari vajpayee indian institute of information technology': 'abv-iiitm',
    'international institute for population sciences': 'iips',
    'jawaharlal nehru port authority': 'jnpa',
    'central warriors sikh sangarsh university': 'cwssu',
    'swami vivekanand national institute of rehabilitation training and research': 'svnirtar',
    'chennai petroleum corporation limited': 'cpcl',
    'juvenile justice board': 'jjb',
    'national institute of indian medical heritage': 'niimh',
    'central agricultural university': 'cau',
    'king george\'s medical university': 'kgmu',
    'babasaheb bhimrao ambedkar university': 'bbau',
    'urban development directorate': 'udd-uk',
    'syama prasad mookerjee port': 'smp-kolkata',
    'indian statistical institute': 'isi-kolkata',
    'institute for stem cell science': 'instem',
    'instem': 'instem'
}

CAMPUS_CITIES = [
    'delhi', 'new delhi', 'tirupati', 'mandi', 'kanpur', 'roorkee', 'kharagpur',
    'dhanbad', 'bhu', 'banaras', 'varanasi', 'bhilai', 'indore', 'amritsar',
    'udaipur', 'jodhpur', 'rishikesh', 'nagpur', 'bhubaneswar', 'guwahati',
    'patna', 'raipur', 'bhopal', 'farrukhabad', 'chitrakoot', 'muzaffarnagar',
    'hamirpur', 'mathura', 'ballia', 'dhamtari', 'kondagaon', 'ambikapur',
    'munger', 'sangrur', 'kapurthala', 'sivaganga', 'kancheepuram', 'kanchipuram',
    'khammam', 'prakasam', 'shibpur', 'kolkata', 'pune', 'mumbai', 'trichy', 'madras',
    'deoghar', 'kozhikode', 'chittoor', 'dharwad', 'calicut', 'jammu', 'gandhinagar',
    'bijnor', 'balangir', 'krishnagiri', 'nagarkurnool', 'kashipur', 'silchar',
    'srinagar', 'agartala', 'surathkal', 'rourkela', 'warangal', 'durgapur',
    'kurukshetra', 'jalandhar', 'jaipur', 'allahabad', 'prayagraj', 'hyderabad',
    'korukonda', 'kalyani', 'madurai', 'narmadapuram', 'vijayapura', 'cuttack',
    'assam', 'uttarakhand', 'bengaluru', 'bangalore', 'bijapur', 'bengdubi',
    'tirupathur', 'chengalpattu', 'salem', 'jhajjar', 'rohtak', 'gorakhpur',
    'nirmal', 'narayanpet', 'daman', 'hazaribagh', 'patiala', 'brahmapur',
    'kallakurichi', 'ganjam', 'mayurbhanj', 'begusarai', 'ezhukone', 'kalaburagi',
    'margao', 'hajipur', 'ri-bhoi', 'yadadri', 'bhuvanagiri', 'burnpur',
    'udupi', 'malpe', 'pakidi', 'morada', 'garudabasa', 'lucknow', 'pilani',
    'visakhapatnam', 'shahdara', 'adoor', 'thrissur', 'jajpur', 'khordha',
    'cuddalore', 'thanjavur', 'mancherial', 'mainpuri', 'agra', 'cooch behar',
    'ambarnath', 'balod'
]

EXAM_ACRONYM_MAP = {
    'junior engineer': 'je',
    'combined graduate level': 'cgl',
    'combined higher secondary level': 'chsl',
    'multi tasking staff': 'mts',
    'assistant loco pilot': 'alp',
    'non technical popular categories': 'ntpc',
    'combined technical services': 'ctse',
    'senior research fellow': 'srf',
    'junior research fellow': 'jrf',
    'research associate': 'ra',
    'project associate': 'pa',
    'project assistant': 'pa',
    'technical assistant': 'ta',
    'technical officer': 'to',
    'young professional': 'yp',
    'assistant professor': 'ap',
    'data entry operator': 'deo',
    'field investigator': 'fi',
    'medical officer': 'mo',
    'general duty': 'gd',
    'central police': 'cpo',
    'gramin dak sevak': 'gds',
    'patent agent': 'patent-agent',
    'personal assistant': 'pa',
    'senior personal assistant': 'spa',
    'stenographer': 'steno',
    'veterinary pharmacist': 'vet-pharmacist',
    'horticulture officer': 'horticulture-officer',
    'assistant environmental engineer': 'aee',
    'hostel welfare officer': 'hwo',
    'anganwadi teacher': 'anganwadi-teacher',
    'anganwadi worker': 'anganwadi-worker',
    'case worker': 'case-worker',
    'software engineer': 'software-eng',
    'trade apprentice': 'trade-apprentice',
    'ayushman mitra': 'ayushman-mitra',
    'crop guard': 'crop-guard',
    'vocational instructor': 'voc-instructor',
    'project research scientist': 'prs',
    'principal project scientist': 'pps',
    'project scientist': 'ps',
    'food safety officer': 'fso',
    'store keeper': 'store-keeper',
    'library assistant': 'lib-asst',
    'technical advisor': 'tech-advisor',
    'lab attendant': 'lab-attendant',
    'sports coach': 'coach',
    'office assistant': 'office-asst',
    'assistant manager': 'am',
    'homeopathy doctor': 'doctor',
    'associate director': 'assoc-dir',
    'senior associate': 'sr-assoc',
    'demonstrator': 'demonstrator',
    'senior resident': 'sr',
    'junior resident': 'jr',
    'draftsman': 'draftsman',
    'supervisor': 'supervisor',
    'special educator': 'special-educator',
    'court assistant': 'court-asst',
    'office attendant': 'office-attendant',
    'counsellor': 'counsellor',
    'shift incharge': 'shift-incharge',
    'subedar': 'subedar',
    'labour welfare officer': 'lwo',
    'junior planner': 'jr-planner',
    'content writer': 'content-writer',
    'executive assistant': 'exec-asst',
    'phlebotomist': 'phlebotomist',
    'headmaster': 'headmaster',
    'headmistress': 'headmistress',
    'field assistant': 'field-asst',
    'civil judge': 'civil-judge',
    'civil assistant surgeon': 'cas',
    'customer service officer': 'cso',
    'para legal volunteer': 'plv',
    'land record assistant': 'lra',
    'peer educator': 'peer-educator',
    'clinical research coordinator': 'crc',
    'editorial assistant': 'editorial-asst',
    'embryologist': 'embryologist',
    'veterinary assistant surgeon': 'vas',
    'chief information commissioner': 'cic',
    'ophthalmic assistant': 'ophthalmic-asst',
    'probation officer': 'probation-officer',
    'young professional': 'yp',
    'data manager': 'data-manager',
    'finance analyst': 'finance-analyst',
    'data analyst': 'data-analyst',
    'project technical support': 'pts',
    'technical support': 'tech-support',
    'perfusionist': 'perfusionist',
    'dietician': 'dietician',
    'pourakarmika': 'pourakarmika',
    'legal consultant': 'legal-consultant',
    'legal expert': 'legal-expert',
    'law officer': 'law-officer',
    'social worker': 'social-worker'
}

def generate_short_slug(board, post_name, year="2026"):
    b_lower = board.lower()
    p_lower = post_name.lower()

    b_key = None
    m_paren = re.search(r'\(([A-Za-z0-9\s-]{2,12})\)', board)
    if m_paren:
        cand = slugify(m_paren.group(1))
        if 2 <= len(cand) <= 12:
            b_key = cand

    if not b_key:
        for full_name, acro in BOARD_ACRONYM_MAP.items():
            if full_name in b_lower:
                b_key = acro
                for city in CAMPUS_CITIES:
                    if city in b_lower and city not in acro:
                        b_key = f"{acro}-{slugify(city)}"
                        break
                break

    if not b_key:
        b_key = slugify(board)[:18].strip('-')

    p_key = None
    p_normalized = p_lower.replace('-', ' ')
    for full_exam, acro in EXAM_ACRONYM_MAP.items():
        if full_exam in p_lower or full_exam in p_normalized:
            p_key = acro
            break

    if not p_key:
        p_clean = slugify(post_name)
        p_clean = re.sub(r'(recruitment|notification|apply|online|offline|posts?|vacanc\w*|total)', '', p_clean)
        p_words = [w for w in p_clean.split('-') if len(w) > 1]
        p_key = '-'.join(p_words[:2]) if p_words else 'jobs'

    p_key = p_key[:18].strip('-')
    slug = f"{b_key}-{p_key}-recruitment-{year}"
    slug = re.sub(r'-+', '-', slug).strip('-')
    if len(slug) > 44:
        excess = len(slug) - 44
        b_trim = b_key[:max(6, len(b_key)-excess)].strip('-')
        slug = f"{b_trim}-{p_key}-recruitment-{year}"
        slug = re.sub(r'-+', '-', slug).strip('-')
    return slug

def format_clean_date(date_str):
    if not date_str:
        return "Refer Notification"
    date_str = clean_text(date_str)

    def _replace_num_date(match):
        d_val, m_val, y_val = int(match.group(1)), int(match.group(2)), int(match.group(3))
        if m_val > 12 and d_val <= 12:
            d_val, m_val = m_val, d_val
        try:
            dt = datetime.date(y_val, m_val, d_val)
            return dt.strftime("%d %B %Y")
        except Exception:
            return match.group(0)

    formatted = re.sub(r'(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})', _replace_num_date, date_str)
    
    month_map = {
        'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
        'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
        'sep': 'September', 'sept': 'September', 'oct': 'October',
        'nov': 'November', 'dec': 'December'
    }
    formatted = re.sub(
        r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b(?:\.?)',
        lambda m: month_map[m.group(1).lower()],
        formatted,
        flags=re.IGNORECASE
    )
    formatted = re.sub(r'(\d{1,2})-(January|February|March|April|May|June|July|August|September|October|November|December)-(\d{4})', r'\1 \2 \3', formatted)
    return formatted

def format_short_qualification(qual_text):
    if not qual_text:
        return "See eligibility criteria"
    clean_q = clean_text(qual_text)
    degrees = []
    patterns = [
        (r'\b10th\b|\bMatriculation\b|\bSecondary\b|\b8th\b', '10th / 8th Pass'),
        (r'\b12th\b|\bIntermediate\b|\b10\+2\b|\bPUC\b', '12th Pass'),
        (r'\bITI\b|\bNAC\b|\bNTC\b', 'ITI'),
        (r'\bDiploma\b|\bPolytechnic\b', 'Diploma'),
        (r'\bB\.?E\b|\bB\.?Tech\b|\bEngineering\b', 'B.Tech / B.E'),
        (r'\bM\.?E\b|\bM\.?Tech\b', 'M.Tech / M.E'),
        (r'\bB\.?Sc\b|\bBSc\b', 'B.Sc'),
        (r'\bM\.?Sc\b|\bMSc\b', 'M.Sc'),
        (r'\bB\.?Com\b|\bBCom\b', 'B.Com'),
        (r'\bM\.?Com\b|\bMCom\b', 'M.Com'),
        (r'\bBBA\b|\bMBA\b|\bPGDM\b', 'MBA / BBA'),
        (r'\bBCA\b|\bMCA\b', 'MCA / BCA'),
        (r'\bB\.?Ed\b|\bBEd\b|\bCTET\b|\bTET\b', 'B.Ed / Teacher'),
        (r'\bLL\.?B\b|\bLLB\b|\bLL\.?M\b|\bLaw\b', 'Law (LL.B / LL.M)'),
        (r'\bMBBS\b|\bMD\b|\bMS\b|\bDNB\b|\bMedical\b', 'MBBS / Medical PG'),
        (r'\bB\.?Pharm\b|\bD\.?Pharm\b|\bPharmacy\b', 'B.Pharm / D.Pharm'),
        (r'\bGNM\b|\bANM\b|\bNursing\b', 'Nursing (GNM / B.Sc)'),
        (r'\bBDS\b|\bMDS\b|\bDental\b', 'BDS / Dental'),
        (r'\bPh\.?D\b|\bDoctorate\b', 'Ph.D / Doctorate'),
        (r'\bGraduate\b|\bGraduation\b|\bDegree\b|\bBachelor\'?s?\b', "Any Bachelor's Degree"),
        (r'\bMaster\'?s?\b|\bPost Graduat\w+', "Master's / PG Degree"),
    ]
    for pat, label in patterns:
        if re.search(pat, clean_q, re.IGNORECASE):
            if label not in degrees:
                degrees.append(label)
                
    if degrees:
        return " | ".join(degrees[:3])
    if len(clean_q) > 75:
        return clean_q[:72] + "..."
    return clean_q

def load_existing_db():
    existing_jobs = {}
    if os.path.exists(DETAILS_FILE):
        try:
            with open(DETAILS_FILE, 'r', encoding='utf-8') as f:
                existing_jobs = json.load(f)
        except Exception:
            pass
            
    existing_list = []
    if os.path.exists(JOBS_DATA_FILE):
        try:
            with open(JOBS_DATA_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = re.findall(r'\"id\":\s*\"([^\"]+)\"[\s\S]*?\"b\":\s*\"([^\"]+)\"[\s\S]*?\"t\":\s*\"([^\"]+)\"[\s\S]*?\"a\":\s*\"([^\"]+)\"', content)
                for jid, b, t, a in matches:
                    existing_list.append({'id': jid, 'board': b, 'title': t, 'advtNo': a})
        except Exception:
            pass
            
    return existing_jobs, existing_list

STOPWORDS = {
    'all', 'india', 'institute', 'technology', 'medical', 'sciences', 'university',
    'department', 'recruitment', 'online', 'offline', 'posts', 'post', 'vacancies',
    'vacancy', '2026', 'total', 'various', 'apply', 'walkin', 'walk-in', 'notification',
    'notice', 'dated', 'govt', 'government', 'state', 'central', 'commission', 'board',
    'national', 'public', 'for', 'and', 'the', 'under'
}

GENERIC_ADVTS = {
    "notification2026", "advtno", "various", "notice", "sric06", "sric",
    "sricrev0917", "rev0917", "icsrpradvt", "icsrpr", "icsr", "advertisement",
    "recruitment", "walkin", "notice2026", "advt2026"
}

def extract_distinctive_tokens(text):
    if not text:
        return set()
    tokens = set(re.findall(r'[a-z0-9]{3,}', text.lower()))
    return tokens - STOPWORDS

def check_duplicate(candidate_id, board, title, advt_no, existing_jobs, existing_list, post_name="", date_str="", pdf_url="", source_url=""):
    # 0. Official Notification PDF URL Match
    if pdf_url and len(pdf_url) > 15:
        clean_pdf = re.sub(r'^https?://(www\.)?', '', pdf_url.lower()).rstrip('/')
        for jid, j in existing_jobs.items():
            for u_obj in j.get('urls', []):
                ex_u = u_obj.get('url', '').strip()
                if ex_u and len(ex_u) > 15:
                    clean_ex_u = re.sub(r'^https?://(www\.)?', '', ex_u.lower()).rstrip('/')
                    if clean_ex_u.endswith('.gov.in') or clean_ex_u.endswith('.nic.in') or clean_ex_u.endswith('.ac.in'):
                        continue
                    if clean_pdf == clean_ex_u or (clean_pdf.endswith('.pdf') and clean_pdf in clean_ex_u) or (clean_ex_u.endswith('.pdf') and clean_ex_u in clean_pdf):
                        return True, f"Identical notification PDF URL matches existing '{jid}'"

    if source_url and len(source_url) > 20:
        clean_src = re.sub(r'^https?://(www\.)?', '', source_url.lower()).rstrip('/')
        for jid, j in existing_jobs.items():
            for u_obj in j.get('urls', []):
                ex_u = u_obj.get('url', '').strip()
                if ex_u and len(ex_u) > 20:
                    clean_ex_u = re.sub(r'^https?://(www\.)?', '', ex_u.lower()).rstrip('/')
                    if clean_src == clean_ex_u:
                        return True, f"Identical source URL matches existing '{jid}'"

    a_norm = re.sub(r'[^a-z0-9]', '', advt_no.lower()) if advt_no else ""
    post_tokens = extract_distinctive_tokens(post_name if post_name else title)
    board_tokens = extract_distinctive_tokens(board)
    post_tokens = post_tokens - board_tokens

    # Advt No match check (Must not be generic prefix)
    if a_norm and len(a_norm) >= 6 and not a_norm.endswith("2026") and a_norm not in GENERIC_ADVTS:
        for jid, j in existing_jobs.items():
            ex_advt = re.sub(r'[^a-z0-9]', '', j.get('advtNo', '').lower())
            if ex_advt and ex_advt not in GENERIC_ADVTS and ex_advt == a_norm:
                # Disambiguate if post designations are completely distinct
                ex_post_tokens = extract_distinctive_tokens(j.get('title', '')) - extract_distinctive_tokens(j.get('board', ''))
                if post_tokens and ex_post_tokens:
                    common = post_tokens.intersection(ex_post_tokens)
                    if not common:
                        continue
                # If both have distinct PDFs, they are distinct circulars under same file number
                if pdf_url and len(pdf_url) > 15:
                    clean_pdf = re.sub(r'^https?://(www\.)?', '', pdf_url.lower()).rstrip('/')
                    ex_pdfs = [re.sub(r'^https?://(www\.)?', '', uo.get('url', '').lower()).rstrip('/') for uo in j.get('urls', []) if uo.get('url', '').lower().endswith('.pdf')]
                    if ex_pdfs and all(clean_pdf != ep for ep in ex_pdfs):
                        continue
                return True, f"Advt No '{j.get('advtNo')}' matches existing '{jid}'"

    q_lower = f"{board} {title}".lower()
    query_campus = [c for c in CAMPUS_CITIES if c in q_lower]

    for jid, j in existing_jobs.items():
        ex_board = j.get('board', '')
        ex_title = j.get('title', '')
        ex_lower = f"{jid} {ex_board} {ex_title}".lower()
        
        job_campus = [c for c in CAMPUS_CITIES if c in ex_lower]
        if query_campus and job_campus:
            if not set(query_campus).intersection(set(job_campus)):
                continue

        # Specific institution / district / school disambiguation
        if ('adarsha vidyalaya' in q_lower and 'adarsha vidyalaya' in ex_lower) or \
           ('child protection' in q_lower and 'child protection' in ex_lower) or \
           ('district medical' in q_lower and 'district medical' in ex_lower) or \
           ('kendriya vidyalaya' in q_lower and 'kendriya vidyalaya' in ex_lower):
            cand_dist = set(re.findall(r'[a-z]{3,}', q_lower)) - {'district', 'child', 'protection', 'unit', 'dcpu', 'recruitment', 'posts', 'odisha', 'adarsha', 'vidyalaya', 'medical', 'health', 'kendriya', 'shri', 'pm', 'notice'}
            ex_dist = set(re.findall(r'[a-z]{3,}', ex_lower)) - {'district', 'child', 'protection', 'unit', 'dcpu', 'recruitment', 'posts', 'odisha', 'adarsha', 'vidyalaya', 'medical', 'health', 'kendriya', 'shri', 'pm', 'notice'}
            if cand_dist and ex_dist and not cand_dist.intersection(ex_dist):
                continue

        ex_board_tokens = extract_distinctive_tokens(ex_board)
        board_match = False
        if board_tokens and ex_board_tokens:
            common_board = board_tokens.intersection(ex_board_tokens)
            if len(common_board) >= max(1, min(len(board_tokens), len(ex_board_tokens)) * 0.6):
                board_match = True

        if board_match:
            # If both have specific PDFs and they are completely different, distinct notices
            if pdf_url and len(pdf_url) > 15:
                clean_pdf = re.sub(r'^https?://(www\.)?', '', pdf_url.lower()).rstrip('/')
                ex_pdfs = [re.sub(r'^https?://(www\.)?', '', uo.get('url', '').lower()).rstrip('/') for uo in j.get('urls', []) if uo.get('url', '').lower().endswith('.pdf')]
                if ex_pdfs and all(clean_pdf != ep for ep in ex_pdfs):
                    continue

            ex_advt = re.sub(r'[^a-z0-9]', '', j.get('advtNo', '').lower())
            if a_norm and ex_advt and len(a_norm) >= 5 and len(ex_advt) >= 5 and a_norm not in GENERIC_ADVTS and ex_advt not in GENERIC_ADVTS:
                if a_norm != ex_advt:
                    continue

            ex_post_tokens = extract_distinctive_tokens(ex_title) - ex_board_tokens
            if post_tokens and ex_post_tokens:
                if ('junior' in post_tokens and 'senior' in ex_post_tokens) or ('senior' in post_tokens and 'junior' in ex_post_tokens):
                    continue
                if ('assistant' in post_tokens and any(k in ex_post_tokens for k in ['associate', 'fellow', 'scientist'])) or \
                   ('associate' in post_tokens and any(k in ex_post_tokens for k in ['assistant', 'fellow', 'scientist'])):
                    continue
                if ('apprentice' in post_tokens and 'apprentice' not in ex_post_tokens) or \
                   ('apprentice' not in post_tokens and 'apprentice' in ex_post_tokens):
                    continue
                if ('nurse' in post_tokens and 'nurse' not in ex_post_tokens) or \
                   ('nurse' not in post_tokens and 'nurse' in ex_post_tokens):
                    continue
                if ('ports' in post_tokens and 'ports' not in ex_post_tokens) or \
                   ('ports' not in post_tokens and 'ports' in ex_post_tokens):
                    continue
                num_q = set(re.findall(r'\b(?:1|2|3|4|5|i|ii|iii|iv|v)\b', (post_name or title).lower()))
                num_ex = set(re.findall(r'\b(?:1|2|3|4|5|i|ii|iii|iv|v)\b', ex_title.lower()))
                if num_q and num_ex and not num_q.intersection(num_ex):
                    continue

                if ('medical' in q_lower and 'medical' not in ex_lower) or ('medical' not in q_lower and 'medical' in ex_lower):
                    if 'scientist' in q_lower and 'scientist' in ex_lower:
                        continue

                common_post = post_tokens.intersection(ex_post_tokens)
                if len(post_tokens) <= 2:
                    if common_post == post_tokens and len(ex_post_tokens) <= 3:
                        return True, f"Same board '{ex_board}' and matching post designation with '{jid}'"
                else:
                    if len(common_post) >= max(2, len(post_tokens) * 0.7):
                        return True, f"Same board '{ex_board}' and matching post designation with '{jid}'"

    return False, ""

def fetch_page(url, ctx):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        }
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=25) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            if attempt == 2:
                print(f"[FETCH ERROR] {url}: {e}")
                return None
            time.sleep(1.0)

def try_extract_advt_from_pdf(pdf_url, ctx):
    if not pdf_url or not pdf_url.startswith('http') or not pdf_url.lower().endswith('.pdf'):
        return ""
    try:
        req = urllib.request.Request(pdf_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = resp.read(2 * 1024 * 1024)
        if not data.startswith(b'%PDF'):
            return ""
        tmp_path = os.path.join(PROJECT_ROOT, 'scratch', 'temp_notice.pdf')
        with open(tmp_path, 'wb') as f:
            f.write(data)
        res = subprocess.run(['pdftotext', '-l', '2', tmp_path, '-'], capture_output=True, text=True, errors='ignore', timeout=5)
        text = res.stdout if res.returncode == 0 else ""
        if text:
            m = re.search(r'(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notification\s*No\.?|Notice\s*No\.?|CEN\s*No\.?|Rc\s*No\.?|No\.)\s*[:\-]?\s*([A-Za-z0-9\/\-\_\.\(\)]+)', text, re.IGNORECASE)
            if m:
                cand = clean_text(m.group(1))
                if 4 <= len(cand) <= 45 and not any(bad in cand.lower() for bad in ['pdf', 'click', 'freejob', 'http', 'table', 'details', 'page', 'date']):
                    return cand
    except Exception:
        pass
    return ""

def parse_vacancy_data(html, url, ctx=None):
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "nav", "footer", "iframe"]):
        tag.extract()
        
    page_title = clean_text(soup.title.string) if soup.title and soup.title.string else ""
    
    # 1. Parse Title Metadata for Ground Truth
    clean_title_str = page_title.replace('–', '-').replace('—', '-').strip()
    
    title_vacancies = 0
    m_vac = re.search(r'\bfor\s+(\d+)\s+', clean_title_str, re.IGNORECASE)
    if not m_vac:
        m_vac = re.search(r'\b(?!202[4-9])(\d+)\s+(?:[A-Za-z0-9\s,\/&-]{0,35}?)\s*posts\b', clean_title_str, re.IGNORECASE)
    if m_vac:
        title_vacancies = int(m_vac.group(1))

    title_post = ""
    m_post = re.search(r'(?:for\s+(?:\d+\s+)?|walkin\s+for\s+)(.*?)(?:\s+posts|\s+vacanc\w*|\s+2026|$)', clean_title_str, re.IGNORECASE)
    if m_post:
        cand_p = clean_text(m_post.group(1))
        cand_p = re.sub(r'^(apply\s+online|apply\s+offline|walkin)\s+(?:for\s+)?', '', cand_p, flags=re.I)
        if cand_p and len(cand_p) > 2 and cand_p.lower() not in ['posts', 'various', 'various posts']:
            title_post = cand_p

    title_board = ""
    m_board = re.search(r'^(.*?)\s+Recruitment', clean_title_str, re.IGNORECASE)
    if m_board:
        title_board = clean_text(m_board.group(1))
    else:
        title_board = clean_title_str.split('-')[0].strip()

    # 2. Extract Data from All Tables
    tables = soup.find_all('table')
    overview_kv = {}
    vacancy_rows = []
    date_rows = []
    post_salary_map = {}
    post_qual_map = {}
    fee_rows = []
    age_rows = []
    exam_pattern_rows = []
    selection_stage_rows = []

    for idx, t in enumerate(tables):
        rows = t.find_all('tr')
        if not rows:
            continue
        first_row_cells = [clean_text(c.get_text()).lower() for c in rows[0].find_all(['td', 'th'])]
        if not first_row_cells:
            continue

        # A. 2-column key-value tables
        if len(first_row_cells) == 2 and any(k in first_row_cells[0] for k in ['particular', 'criteria', 'requirement', 'detail', 'information', 'post', 'category', 'parameter', 'company', 'organisation', 'organization', 'board', 'institute', 'department', 'recruiting', 'condition']):
            if not any(k in first_row_cells[1] for k in ['total posts', 'vacancies', 'scale of pay', 'no of post']):
                for r in rows:
                    cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                    if len(cols) == 2 and cols[0].lower() not in overview_kv:
                        overview_kv[cols[0].lower()] = cols[1]

        # B. Salary Table
        if any(k in c for c in first_row_cells for k in ['post', 'position', 'trade', 'category', 'designation', 'vc no']) and \
           any(k in c for c in first_row_cells for k in ['salary', 'pay', 'scale', 'remuneration', 'stipend', 'honorarium', 'emoluments']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    p_key = slugify(cols[0])
                    post_salary_map[p_key] = cols[1]

        # C. Qualification Table
        elif any(k in c for c in first_row_cells for k in ['post', 'position', 'trade', 'category', 'designation', 'vc no']) and \
             any(k in c for c in first_row_cells for k in ['qualification', 'eligibility', 'education']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    p_key = slugify(cols[0])
                    post_qual_map[p_key] = cols[1]

        # D. Fee Table
        elif any(k in c for c in first_row_cells for k in ['category', 'candidate']) and any(k in c for c in first_row_cells for k in ['fee', 'total fee', 'application fee']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    fee_rows.append({"category": cols[0], "fee": cols[-1]})

        # E. Age Limit Table
        elif any(k in c for c in first_row_cells for k in ['post', 'category']) and any(k in c for c in first_row_cells for k in ['age limit', 'upper age', 'maximum age', 'age relaxation']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    age_rows.append(f"{cols[0]}: {cols[1]}")

        # F. Exam Pattern Table
        elif any(k in c for c in first_row_cells for k in ['paper', 'part']) and any(k in c for c in first_row_cells for k in ['subject', 'topic']) and any(k in c for c in first_row_cells for k in ['mark', 'question', 'duration']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 3:
                    exam_pattern_rows.append({
                        "paper": cols[0],
                        "subject": cols[1],
                        "details": " | ".join(cols[2:])
                    })

        # G. Selection Stage Table
        elif any(k in c for c in first_row_cells for k in ['stage']) and any(k in c for c in first_row_cells for k in ['detail', 'name', 'test', 'criteria']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    selection_stage_rows.append(f"{cols[0]}: {cols[1]}")

        # H. Important Dates Table
        elif (any(k in c for c in first_row_cells for k in ['event', 'activity', 'important date']) or \
              (len(first_row_cells) == 2 and re.search(r'\b(date|dates|schedule|timeline|deadline)\b', first_row_cells[1]))) and \
             not any(k in c for c in first_row_cells for k in ['pay', 'salary', 'stipend', 'remuneration', 'honorarium', 'emoluments', 'qualification', 'marks', 'weightage', 'fee']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    date_rows.append(cols)

        # I. Vacancy Count Table
        elif any(k in c for c in first_row_cells for k in ['post name', 'name of the post', 'post', 'position', 'discipline', 'trade', 'department', 'cadre']) and \
             any(k in c for c in first_row_cells for k in ['vacancies', 'vacancy', 'total posts', 'total post', 'posts', 'no of post', 'no. of post', 'seats', 'total']) and \
             not any(k in c for c in first_row_cells for k in ['salary', 'pay', 'stipend', 'honorarium', 'remuneration', 'emoluments', 'qualification', 'weightage', 'marks', 'fee', 'event', 'paper', 'stage']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2 and cols[0].lower() not in ['total', 's. no.', 's.no.', 'sl. no.']:
                    # Handle sl no in first column
                    if cols[0].isdigit() and len(cols) > 2:
                        cols = cols[1:]
                    vacancy_rows.append(cols)

    # 3. Discovered Official URLs
    official_pdf_url = ""
    official_site_url = ""
    official_apply_url = ""
    
    for h in soup.find_all(["h2", "h3"]):
        if "important link" in h.get_text().lower():
            ul = h.find_next(["ul", "table"])
            if ul:
                for a in ul.find_all("a", href=True):
                    href = clean_text(a["href"])
                    txt = a.get_text(" ", strip=True).lower()
                    parent_txt = a.parent.get_text(" ", strip=True).lower()
                    combined_txt = f"{txt} {parent_txt}"
                    if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter', 'arattai', 'sarkariresult']):
                        continue
                    if not href.startswith('http'):
                        continue
                    if 'notification' in combined_txt or 'pdf' in combined_txt or href.endswith('.pdf'):
                        if not official_pdf_url:
                            official_pdf_url = href
                    elif 'apply' in combined_txt or 'portal' in combined_txt or 'registration' in combined_txt:
                        if not official_apply_url:
                            official_apply_url = href
                    elif 'official' in combined_txt or 'website' in combined_txt:
                        if not official_site_url:
                            official_site_url = href
            break

    if not official_pdf_url or not official_site_url or not official_apply_url:
        for a in soup.find_all('a', href=True):
            href = clean_text(a['href'])
            txt = clean_text(a.get_text()).lower()
            tr_parent = a.find_parent('tr')
            row_txt = clean_text(tr_parent.get_text()).lower() if tr_parent else ""
            combined_txt = f"{txt} {row_txt}"
            if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter', 'arattai', 'sarkariresult']):
                continue
            if not href.startswith('http'):
                continue
            if (href.endswith('.pdf') or 'notification' in combined_txt or 'pdf' in combined_txt) and not official_pdf_url:
                official_pdf_url = href
            elif ('apply' in combined_txt or 'registration' in combined_txt or 'portal' in combined_txt) and not official_apply_url:
                official_apply_url = href
            elif any(k in combined_txt for k in ['official website', 'portal', 'website']) and not official_site_url:
                official_site_url = href

    # 4. Resolve Board Name
    board = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['recruiting body', 'recruiting organization', 'recruiting organisation', 'recruitment board', 'organization', 'organisation', 'authority', 'company', 'board', 'institute', 'department', 'commission', 'court', 'university', 'society', 'centre', 'corporation']):
            if len(v) > 2 and v.lower() not in ['details', 'various', 'given below', ' samvida) basis', ' samvida)']:
                board = v
                break
    if 'workplace' in overview_kv and (not board or any(bad in board.lower() for bad in ['m/s', 'services', 'private limited', 'pvt', 'agency', 'contractor'])):
        board = overview_kv['workplace']
    elif not board or len(board) < 3:
        board = title_board
    board = re.sub(r'\s*\(India[\'\w\s]+\)\s*', '', board).strip()
    board = re.sub(r'\s*-\s*Schedule\s*[‘\'"][A-Z][’\'"].*$', '', board).strip()
    board = re.sub(r'\s*\(A Govt\. of India Enterprise.*?\)', '', board, flags=re.IGNORECASE).strip()

    # 5. Resolve Post Name
    post_name = ""
    for k, v in overview_kv.items():
        if any(term == k for term in ['post', 'posts', 'post name', 'post names', 'name of post', 'name of posts', 'name of exam', 'exam name', 'position', 'positions', 'designation', 'designations']):
            if v and not re.match(r'^\d+$', v) and v.lower() not in ['total posts', 'no of posts', 'salary', 'various', 'posts', 'details', 'given below', 'educational qualification', 'pay scale (rs.)', 'upper age limit', 'contract (samvida) basis']:
                post_name = v
                break
    if not post_name or post_name.lower() in ['various posts', 'various', 'no. of posts']:
        if title_post:
            post_name = title_post
    if not post_name or re.match(r'^\d+$', post_name):
        post_name = "Various Posts"

    # 6. Resolve Vacancies Count
    vacancies_num = 1
    # Check overview_kv first for exact 'total posts'
    for k, v in overview_kv.items():
        if any(term in k for term in ['total post', 'total vacancies', 'no of post', 'vacancies']):
            clean_num_str = v.replace(',', '')
            vm = re.search(r'\d+', clean_num_str)
            if vm:
                cand_v = int(vm.group(0))
                # Protect against salary figures or postal codes
                if cand_v < 50000:
                    vacancies_num = cand_v
                    break

    # If vacancies_num is 1 and title_vacancies is valid
    if vacancies_num == 1 and title_vacancies > 0 and title_vacancies < 50000:
        vacancies_num = title_vacancies

    # Check sum of vacancy_rows
    if vacancy_rows:
        sum_rows = 0
        for r in vacancy_rows:
            v_str = r[1].replace(',', '') if len(r) > 1 else "1"
            m = re.search(r'\d+', v_str)
            if m:
                sum_rows += int(m.group(0))
        if sum_rows > 0 and sum_rows < 50000:
            if vacancies_num <= 1 or vacancies_num < sum_rows:
                vacancies_num = sum_rows

    # Final guard against year being mistaken for vacancy
    if vacancies_num in [2025, 2026, 2027]:
        vacancies_num = 1 if title_vacancies <= 0 else title_vacancies

    # 7. Salary
    salary_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['salary', 'stipend', 'pay', 'remuneration', 'scale of pay', 'honorarium', 'emoluments']):
            if len(v) > 2 and v.lower() not in ['details', 'various', 'given below']:
                salary_text = v
                break
    if not salary_text and post_salary_map:
        salary_text = " | ".join([f"{k.title()}: {v}" for k, v in list(post_salary_map.items())[:3]])
    if not salary_text:
        salary_text = "As per official institutional pay scale rules"

    # 8. Qualification
    qual_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['qualification', 'eligibility', 'education', 'academic qualification']):
            if len(v) > 3 and v.lower() not in ['details', 'various', 'given below']:
                qual_text = v
                break
    if not qual_text and post_qual_map:
        qual_text = " | ".join([f"{k.title()}: {v}" for k, v in list(post_qual_map.items())[:3]])
    if not qual_text:
        for h in soup.find_all(['h2', 'h3']):
            if any(term in h.get_text().lower() for term in ['qualification', 'eligibility']):
                curr = h.find_next(['p', 'ul', 'ol', 'table'])
                if curr:
                    qual_text = clean_text(curr.get_text(' ', strip=True))[:300]
                    break
    if not qual_text:
        qual_text = "Degree / Diploma / Post Graduation or equivalent from a recognized University / Board as per official notification."

    # 9. Age Limit
    age_text = ""
    for k, v in overview_kv.items():
        if 'age limit' in k or 'age criteria' in k:
            if len(v) > 2 and v.lower() not in ['details', 'as per rules']:
                age_text = v
                break
    if not age_text and age_rows:
        age_text = " | ".join(age_rows[:3])
    if not age_text:
        age_text = "As per government recruitment norms (+ standard relaxation for SC/ST/OBC/PwBD categories)"

    # 10. Application Mode
    apply_mode = "Online via Official Portal"
    for k, v in overview_kv.items():
        if 'apply mode' in k or 'mode of application' in k:
            apply_mode = v
            break
        elif 'walk-in' in k or 'walkin' in k:
            apply_mode = "Walk-in Interview"
            break
    if 'walkin' in page_title.lower() or 'walk-in' in page_title.lower():
        apply_mode = "Walk-in Interview"
    elif 'offline' in page_title.lower():
        apply_mode = "Apply Offline"
    elif 'online' in page_title.lower():
        apply_mode = "Apply Online"

    # 11. Important Dates
    important_dates = []
    for row in date_rows:
        if len(row) >= 2:
            ev_title = clean_text(row[0])
            d_val = format_clean_date(row[1])
            if ev_title and d_val:
                important_dates.append({
                    "event": ev_title,
                    "date": d_val
                })

    walkin_date = ""
    last_date = ""
    for k, v in overview_kv.items():
        if 'walk-in' in k or 'walkin' in k:
            walkin_date = format_clean_date(v)
        elif 'last date' in k or 'closing' in k:
            last_date = format_clean_date(v)

    curr_month_year = datetime.datetime.now().strftime("%B %Y")
    if not important_dates:
        if walkin_date:
            important_dates.append({"event": "Notification Release Date", "date": curr_month_year})
            important_dates.append({"event": "Walk-in Interview Date", "date": walkin_date})
        elif last_date:
            important_dates.append({"event": "Notification Release Date", "date": curr_month_year})
            important_dates.append({"event": "Application Start Date", "date": curr_month_year})
            important_dates.append({"event": "Last Date to Apply", "date": last_date})
        else:
            important_dates.append({"event": "Notification Release Date", "date": curr_month_year})
            important_dates.append({"event": "Application Closing Date", "date": "Refer Official Notification"})

    summary_last_date = "Refer Notification"
    if walkin_date:
        summary_last_date = f"{walkin_date} (Walk-in)"
    elif last_date:
        summary_last_date = last_date
    else:
        for dt in important_dates:
            ev = dt.get("event", "").lower()
            if any(k in ev for k in ["last date", "closing", "deadline", "walk-in", "walkin", "end date", "receipt"]):
                summary_last_date = dt.get("date", "Refer Notification")
                break
        if summary_last_date == "Refer Notification" and len(important_dates) > 1:
            summary_last_date = important_dates[-1].get("date", "Refer Notification")

    # 12. Advt No
    advt_no = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['advt', 'advertisement', 'notification no', 'notice no', 'cen no', 'nia no', 'rcno', 'employment notice', 'f.no']) or ('notification' in k and 'date' not in k and 'period' not in k) or k == 'no':
            if v and v.lower() not in ['details', 'various', 'given below', 'refer notification', 'contract (samvida) basis']:
                advt_no = v
                break
    if not advt_no:
        advt_match = re.search(r'(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notification\s*No\.?|Notice\s*No\.?|CEN\s*No\.?|NIA\s*No\.?|F\.No\.?)\s*[:\-]?\s*([A-Za-z0-9\/\-\_\.\(\)\,\s]+?)(?:\s+dated|\s+Dated|\n|\.|\,|$)', html, re.IGNORECASE)
        if advt_match:
            advt_candidate = clean_text(advt_match.group(1))
            if 3 <= len(advt_candidate) <= 45 and not any(bad in advt_candidate.lower() for bad in ['pdf', 'click', 'freejob', 'http', 'table', 'details']):
                advt_no = advt_candidate
    if official_pdf_url and (not advt_no or advt_no.endswith('/2026')):
        pdf_advt = try_extract_advt_from_pdf(official_pdf_url, ctx)
        if pdf_advt:
            advt_no = pdf_advt
    if not advt_no:
        advt_no = f"{slugify(board)[:14].upper()}/2026"

    # 13. Location
    location = "India"
    for k, v in overview_kv.items():
        if any(term in k for term in ['job location', 'location', 'place of posting']):
            if v and len(v) > 2 and v.lower() not in ['details', 'as per rules']:
                location = clean_text(v)
                break
    if location == "India":
        loc_matches = re.findall(r'\b(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Delhi|New Delhi|Chandigarh|Puducherry|Daman|Andaman & Nicobar|Port Blair|Gorakhpur|Salem|Tirupathur|Vijayawada|Kolkata|Hyderabad|Bengaluru|Ranchi|Patna|Bhopal|Dehradun|Roorkee|Ahmedabad|Vadodara|Kurukshetra|Jammu|Nirmal|Narayanpet)\b', page_title + " " + board + " " + html[:2500], re.IGNORECASE)
        if loc_matches:
            location = loc_matches[0].title()

    # 14. Vacancies Details Breakdown
    vacancies_details = []
    if vacancy_rows:
        for r in vacancy_rows:
            p_name = clean_text(r[0])
            v_cnt = clean_text(r[1]) if len(r) > 1 else "1"
            p_key = slugify(p_name)
            p_sal = post_salary_map.get(p_key, salary_text)
            p_q = post_qual_map.get(p_key, clean_text(r[2]) if len(r) > 2 else qual_text)
            clean_v_str = v_cnt.replace(',', '')
            num_match = re.search(r'\d+', clean_v_str)
            cnt_num = int(num_match.group(0)) if num_match else 1
            vacancies_details.append({
                "postName": p_name,
                "vacancies": v_cnt,
                "total": cnt_num,
                "qualification": p_q,
                "payScale": p_sal
            })
    else:
        vacancies_details.append({
            "postName": post_name,
            "vacancies": str(vacancies_num),
            "total": vacancies_num,
            "qualification": qual_text,
            "payScale": salary_text
        })

    # 15. URLs List
    urls_list = []
    if official_apply_url:
        urls_list.append({
            "title": f"Apply Online - {board}",
            "url": official_apply_url
        })
    if official_pdf_url:
        urls_list.append({
            "title": f"Download {board} Official Notification PDF",
            "url": official_pdf_url
        })
    if official_site_url:
        urls_list.append({
            "title": f"{board} Official Website / Portal",
            "url": official_site_url
        })
    if not urls_list:
        urls_list.append({
            "title": f"{board} Official Recruitment Notification",
            "url": url
        })

    apply_action = "Apply Online"
    if "walk-in" in apply_mode.lower() or "walkin" in apply_mode.lower():
        apply_action = "Walk-in Interview"
    elif "offline" in apply_mode.lower():
        apply_action = "Apply Offline"

    clean_post_for_title = post_name
    if clean_post_for_title.lower().endswith(" posts"):
        clean_post_for_title = clean_post_for_title[:-6].strip()
    elif clean_post_for_title.lower().endswith(" post"):
        clean_post_for_title = clean_post_for_title[:-5].strip()

    title_str = f"{board} Recruitment 2026 Notification Out for {vacancies_num} {clean_post_for_title} Posts | {apply_action}"

    return {
        "board": board,
        "title": title_str,
        "postName": post_name,
        "vacancies": vacancies_num,
        "advtNo": advt_no,
        "salary": salary_text,
        "qualification": qual_text,
        "ageLimit": age_text,
        "applicationMode": apply_mode,
        "importantDates": important_dates,
        "summaryLastDate": summary_last_date,
        "vacanciesDetails": vacancies_details,
        "jobLocation": location,
        "urls": urls_list,
        "feeDetails": fee_rows,
        "examPattern": exam_pattern_rows,
        "selectionStages": selection_stage_rows,
        "sourceUrl": url
    }

def generate_rich_job_schema(data):
    board = data["board"]
    title = data["title"]
    vacancies = data["vacancies"]
    post_name = data["postName"]
    advt_no = data["advtNo"]
    salary = data["salary"]
    qualification = data["qualification"]
    age_limit = data["ageLimit"]
    app_mode = data["applicationMode"]
    location = data["jobLocation"]
    important_dates = data["importantDates"]
    vacancies_details = data["vacanciesDetails"]
    urls = data["urls"]
    last_date = data["summaryLastDate"]
    fee_details_extracted = data.get("feeDetails", [])
    exam_pattern_extracted = data.get("examPattern", [])
    selection_stages_extracted = data.get("selectionStages", [])

    job_id = generate_short_slug(board, post_name, year="2026")

    seo_title = f"{board} Recruitment 2026 ({vacancies} {post_name} Posts) {app_mode} | NewVacancyAlert"
    seo_desc = f"{board} recruitment 2026 notification for {vacancies} {post_name} vacancies. Check eligibility criteria, salary, qualification, age limit & application details. Apply before {last_date}."
    if len(seo_desc) > 165:
        seo_desc = seo_desc[:162] + "..."

    focus_keywords = f"{board} Recruitment 2026, {board} {post_name} Vacancy 2026, {board} Notification 2026, {post_name} Jobs 2026"
    lsi_keywords = f"{board} Eligibility Criteria, {board} Salary Pay Scale, {board} Selection Process, {board} Apply {app_mode}, {board} Advt {advt_no}"

    overview = [
        f"{board} has officially announced employment advertisement notification {advt_no} inviting applications for {vacancies} vacancies for {post_name} posts.",
        f"Candidates meeting the prescribed eligibility conditions ({qualification[:120]}...) and age requirements can submit their candidature via {app_mode}. The closing deadline / scheduled date is {last_date}.",
        f"Selected appointees will be stationed in {location}, receiving official compensation ({salary[:90]}), statutory allowances, and established public service benefits as per organizational regulations."
    ]

    highlights = [
        {"label": "Recruitment Authority", "value": board},
        {"label": "Post Name", "value": post_name},
        {"label": "Advertisement No.", "value": advt_no},
        {"label": "Total Vacancies", "value": f"{vacancies} Posts"},
        {"label": "Educational Qualification", "value": qualification[:150]},
        {"label": "Age Limit", "value": age_limit},
        {"label": "Salary / Remuneration", "value": salary[:150]},
        {"label": "Job Location", "value": location},
        {"label": "Application Mode", "value": app_mode},
        {"label": "Important Date / Deadline", "value": last_date},
        {"label": "Official Website", "value": urls[-1]["url"] if urls else "Official Government Portal"}
    ]

    if fee_details_extracted:
        fee_details = fee_details_extracted
    else:
        fee_details = [
            {"category": "General / OBC / EWS Candidates", "fee": "As per official notification guidelines / Exempted if unspecified"},
            {"category": "SC / ST / PwBD / Female Candidates", "fee": "Exempted / Concessional as per government norms"}
        ]

    if selection_stages_extracted:
        selection_stages = selection_stages_extracted
    else:
        selection_stages = [
            "Screening and verification of minimum educational eligibility criteria and submitted application credentials.",
            "Shortlisting based on academic merit, research publications, or written examination / skill assessment (where applicable).",
            "Personal Interview / Walk-in Interview / Practical Assessment conducted by the Selection Committee.",
            "Document Verification of original academic degrees, caste/category certificates, and experience records.",
            "Final Medical Fitness Examination and issuance of official appointment letter."
        ]

    how_to_apply = [
        f"Visit the official portal or access the notification link provided at {urls[0]['url'] if urls else 'official website'}.",
        "Carefully read the official advertisement guidelines, terms of engagement, and eligibility conditions before applying.",
        f"For {app_mode}: Ensure all required bio-data forms, online registration, or prescribed proforma are accurately completed.",
        "Attach/Upload clear scanned copies of required educational certificates, mark sheets, age proof, identity proof, and photographs.",
        "Pay the prescribed application fee (if applicable) through official designated payment channels.",
        "Submit the application form or report to the designated interview venue on the scheduled date with original credentials and self-attested copies.",
        "Retain an acknowledgement receipt or printed copy of the submitted application for subsequent stages."
    ]

    docs_required = [
        "Signed Application Form in prescribed format / Online Application Printout.",
        "Class 10th (Matriculation) Certificate as proof of Date of Birth.",
        "All Academic Marksheets and Degree/Diploma Certificates (Graduation/Post Graduation/Technical Qualifications).",
        "Relevant Experience Certificates and NOC from current employer (if employed in Govt/PSU).",
        "Valid Category / Caste Certificate (SC/ST/OBC-NCL/EWS) issued by competent authority.",
        "Recent Passport Size Color Photographs and valid Photo ID Proof (Aadhaar/PAN/Voter ID/Passport)."
    ]

    faqs = [
        {
            "question": f"What is the total number of vacancies announced for {board} Recruitment 2026?",
            "answer": f"A total of {vacancies} vacancies have been officially announced for {post_name} under {board} Recruitment 2026."
        },
        {
            "question": f"What is the official Advertisement Number for this {board} recruitment drive?",
            "answer": f"The official advertisement number for this recruitment notification is {advt_no}."
        },
        {
            "question": f"What educational qualification is required to apply for {post_name} in {board}?",
            "answer": f"Candidates must possess {qualification}. Please refer to the official notification PDF for complete discipline-specific details."
        },
        {
            "question": f"What is the prescribed age limit for {board} {post_name} posts?",
            "answer": f"The prescribed age limit is {age_limit}. Standard age relaxations apply for SC, ST, OBC, PwBD, and Ex-Servicemen as per government norms."
        },
        {
            "question": f"What is the monthly salary or pay scale offered for {post_name} in {board}?",
            "answer": f"Selected candidates will receive {salary}, along with admissible allowances as per official organizational policy."
        },
        {
            "question": f"What is the mode of application for {board} Recruitment 2026?",
            "answer": f"The application mode is {app_mode}. Candidates should follow the official submission guidelines carefully."
        },
        {
            "question": f"What is the last date to apply or interview date for {board} {post_name}?",
            "answer": f"The last date for application submission or scheduled event date is {last_date}."
        },
        {
            "question": f"What is the selection process for {board} {post_name} recruitment?",
            "answer": "The selection process involves initial scrutiny of qualifications, shortlisting, personal interview / skill assessment / written test, and document verification."
        },
        {
            "question": f"Where will the selected candidates be posted for this {board} vacancy?",
            "answer": f"The selected candidates will be posted in {location} or designated project sites/campuses under {board}."
        },
        {
            "question": f"Is there any application fee for {board} {post_name} Recruitment 2026?",
            "answer": "Application fee details are specified in the official notification. Reserved categories and female applicants are generally exempt or entitled to concessions."
        },
        {
            "question": f"Are candidates in their final year/semester eligible to apply?",
            "answer": "Candidates must possess the requisite degree and final mark sheet on or before the crucial closing date specified in the notification."
        },
        {
            "question": f"Is age relaxation applicable for reserved category applicants?",
            "answer": "Yes, standard age relaxations (5 years for SC/ST, 3 years for OBC-NCL, and 10+ years for PwBD) are applicable as per Central/State Government rules."
        },
        {
            "question": f"What documents are required during interview and verification?",
            "answer": "Candidates must carry 10th certificate for DOB proof, degree certificates, all semester mark sheets, caste certificate, experience certificates, photo ID proof, and self-attested photocopies."
        },
        {
            "question": f"Can candidates currently employed in Government/PSU apply?",
            "answer": "Yes, candidates working in Central/State Government or PSUs can apply provided they produce a 'No Objection Certificate' (NOC) from their employer at the time of interview."
        },
        {
            "question": f"How can I download the official notification PDF for {board} Recruitment 2026?",
            "answer": f"The official notification PDF can be downloaded directly from the official link: {urls[0]['url'] if urls else 'official website'}."
        },
        {
            "question": f"Is this a permanent post or contractual engagement in {board}?",
            "answer": f"Please refer to the official advertisement ({advt_no}) for the precise tenure and engagement terms (regular/contractual/project-basis) for {post_name}."
        },
        {
            "question": f"Where can I check updates regarding admit cards, interview schedules, or results for {board}?",
            "answer": f"All official updates, interview lists, and result notices will be published directly on the official {board} recruitment portal: {urls[-1]['url'] if urls else 'official portal'}."
        },
        {
            "question": f"Can candidates from all states and UTs in India apply for {board} vacancies?",
            "answer": "Yes, Indian citizens fulfilling the required educational qualification, age limit, and language proficiency criteria are eligible to apply."
        },
        {
            "question": f"What should I do if there is a discrepancy in my online application details?",
            "answer": f"Candidates must verify all details before final submission. In case of corrections, check the official {board} portal during the edit window if provided."
        },
        {
            "question": f"Who can be contacted for technical assistance regarding {board} recruitment application?",
            "answer": f"Candidates may contact the official helpdesk or email address provided on the {board} official website."
        }
    ]

    schema = {
        "id": job_id,
        "seoTitle": seo_title,
        "seoDescription": seo_desc,
        "focusKeywords": focus_keywords,
        "lsiKeywords": lsi_keywords,
        "title": title,
        "board": board,
        "advtNo": advt_no,
        "vacancies": vacancies,
        "jobLocation": location,
        "applicationMode": app_mode,
        "applicationStatus": f"Active - Apply before {last_date}",
        "lastUpdated": datetime.datetime.now().strftime("%Y-%m-%d"),
        "overview": overview,
        "highlights": highlights,
        "importantDates": important_dates,
        "vacanciesDetails": vacancies_details,
        "eligibility": {
            "education": [qualification] if isinstance(qualification, str) else qualification,
            "ageLimit": age_limit,
            "medicalStandards": "Standard physical and medical fitness as per organizational regulations."
        },
        "salary": {
            "payLevel": "As per institutional scales",
            "initialPay": salary,
            "allowances": "DA, HRA, Medical and other allowances as applicable per government rules."
        },
        "applicationFee": fee_details,
        "howToPayFee": [
            "Online via Net Banking, Debit Card, Credit Card or UPI payment gateways.",
            "Offline via Demand Draft / Postal Order / Challan if specified in official notification.",
            "Retain transaction e-receipt and registration slip for future recruitment stages."
        ],
        "selectionProcess": selection_stages,
        "howToApply": how_to_apply,
        "howToApplySteps": how_to_apply,
        "documentsRequired": docs_required,
        "importantInstructions": [
            "Verify all eligibility criteria, educational certificates, and age limits before submitting the application.",
            "Complete and submit application forms well before the deadline to avoid server overload or transit delays.",
            "Ensure that email addresses and phone numbers provided remain active for official interview communications."
        ],
        "faqs": faqs,
        "urls": urls
    }

    if exam_pattern_extracted:
        schema["examPattern"] = exam_pattern_extracted

    return schema

def safe_write_json(filepath, data):
    for attempt in range(5):
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            time.sleep(0.3)
    try:
        tmp_file = filepath + ".tmp"
        with open(tmp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        if os.path.exists(filepath):
            os.remove(filepath)
        os.rename(tmp_file, filepath)
        return True
    except Exception as e:
        print(f"[WARN] Failed to write {filepath}: {e}")
        return False

def safe_write_text(filepath, content):
    for attempt in range(5):
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            time.sleep(0.3)
    try:
        tmp_file = filepath + ".tmp"
        with open(tmp_file, 'w', encoding='utf-8') as f:
            f.write(content)
        if os.path.exists(filepath):
            os.remove(filepath)
        os.rename(tmp_file, filepath)
        return True
    except Exception as e:
        print(f"[WARN] Failed to write {filepath}: {e}")
        return False

def add_job_to_system(job_schema):
    job_id = job_schema["id"]
    
    # 1. Update jobDetails.json
    details_data = {}
    if os.path.exists(DETAILS_FILE):
        try:
            with open(DETAILS_FILE, 'r', encoding='utf-8') as f:
                details_data = json.load(f)
        except Exception:
            details_data = {}
            
    details_data[job_id] = job_schema
    safe_write_json(DETAILS_FILE, details_data)
        
    # 2. Update jobsData.ts
    with open(JOBS_DATA_FILE, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

    if f'"id": "{job_id}"' not in jobs_text:
        qual_val = format_short_qualification(job_schema.get("eligibility", {}).get("education", "See eligibility"))
            
        post_date = datetime.datetime.now().strftime("%d %B %Y")
        last_date = job_schema.get("applicationStatus", "").replace("Active - Apply before ", "").strip()
        if not last_date or "Refer" in last_date:
            last_date = job_schema.get("importantDates", [{}])[-1].get("date", "Refer Notification")
        last_date = format_clean_date(last_date)
                
        summary_entry = {
            "id": job_id,
            "b": job_schema.get("board", ""),
            "t": job_schema.get("title", ""),
            "d": post_date,
            "l": last_date,
            "a": job_schema.get("advtNo", ""),
            "q": qual_val,
            "desc": job_schema.get("overview", [""])[0],
            "u": job_schema.get("urls", [{}])[0].get("url", "") if job_schema.get("urls") else ""
        }
        marker = "export const JOBS_DATA: JobEntry[] = ["
        entry_json = json.dumps(summary_entry, indent=4, ensure_ascii=False)
        new_content = jobs_text.replace(marker, f"{marker}\n  {entry_json},")
        safe_write_text(JOBS_DATA_FILE, new_content)
            
    # 3. Update jobUploadDates.json
    upload_dates = {}
    if os.path.exists(UPLOAD_DATES_FILE):
        try:
            with open(UPLOAD_DATES_FILE, 'r', encoding='utf-8') as f:
                upload_dates = json.load(f)
        except Exception:
            upload_dates = {}
    if job_id not in upload_dates:
        upload_dates[job_id] = datetime.datetime.now().strftime("%Y-%m-%d")
        safe_write_json(UPLOAD_DATES_FILE, upload_dates)
            
    return True

def run_cmd(cmd_list):
    res = subprocess.run(cmd_list, cwd=PROJECT_ROOT, capture_output=True, text=True)
    return res.returncode == 0, res.stdout, res.stderr

def main():
    print("================================================================")
    print("         BATCH URL VACANCY ADDER - RUNNING PIPELINE             ")
    print("================================================================")
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    input_list = INPUT_URLS
    if os.path.exists(URLS_FILE):
        try:
            with open(URLS_FILE, 'r', encoding='utf-8-sig') as f:
                input_list = json.load(f)
        except Exception:
            pass

    seen_urls = set()
    unique_urls = []
    for u in input_list:
        if u not in seen_urls:
            seen_urls.add(u)
            unique_urls.append(u)

    print(f"Total Unique URLs to process: {len(unique_urls)}\n")

    added_jobs = []
    skipped_jobs = []
    added_jobs_count = 0
    processed_urls = set()

    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                prog = json.load(f)
                added_jobs = prog.get('added_jobs', [])
                skipped_jobs = prog.get('skipped_jobs', [])
                added_jobs_count = len(added_jobs)
                processed_urls = set(prog.get('processed_urls', []))
                print(f"[RESUME] Resuming from progress file: {added_jobs_count} added, {len(skipped_jobs)} skipped, {len(processed_urls)} processed.\n")
        except Exception:
            pass

    for idx, url in enumerate(unique_urls, 1):
        if url in processed_urls:
            continue

        print(f"\n[{idx}/{len(unique_urls)}] Processing URL: {url}")
        html = fetch_page(url, ctx)
        if not html:
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": "Failed to fetch webpage"})
            processed_urls.add(url)
            safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})
            continue

        try:
            raw_data = parse_vacancy_data(html, url, ctx=ctx)
        except Exception as e:
            print(f"[PARSE ERROR] {url}: {e}")
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": f"Parsing exception: {e}"})
            processed_urls.add(url)
            safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})
            continue

        existing_jobs, existing_list = load_existing_db()
        candidate_id = generate_short_slug(raw_data['board'], raw_data['postName'], year="2026")
        target_pdf_url = ""
        for u_obj in raw_data.get("urls", []):
            if isinstance(u_obj, dict) and u_obj.get("url"):
                u_str = u_obj.get("url")
                if u_str.endswith(".pdf") or "notification" in u_obj.get("title", "").lower() or "form.php" in u_str:
                    target_pdf_url = u_str
                    break
        is_dup, dup_reason = check_duplicate(
            candidate_id, raw_data["board"], raw_data["title"], raw_data["advtNo"],
            existing_jobs, existing_list, post_name=raw_data["postName"],
            pdf_url=target_pdf_url, source_url=url
        )
        if is_dup:
            print(f"⏩ [SKIPPED DUPLICATE] {raw_data['board']} - {raw_data['postName']}: {dup_reason}")
            skipped_jobs.append({
                "url": url,
                "title": raw_data["title"],
                "board": raw_data["board"],
                "reason": f"Duplicate ({dup_reason})"
            })
            processed_urls.add(url)
            safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})
            continue

        # Ensure unique candidate_id if base collision exists
        base_id = candidate_id
        counter = 1
        m_art = re.search(r'-(\d{5,8})(?:/|$)', url)
        art_id = m_art.group(1) if m_art else ""
        while candidate_id in existing_jobs:
            if art_id and counter == 1:
                candidate_id = f"{base_id}-{art_id}"
            else:
                candidate_id = f"{base_id}-{counter}"
            counter += 1

        # Generate rich schema
        schema = generate_rich_job_schema(raw_data)
        schema["id"] = candidate_id
        add_job_to_system(schema)
        added_jobs_count += 1
        processed_urls.add(url)
        print(f"✅ [ADDED #{added_jobs_count}] {schema['id']} | {raw_data['board']} | {raw_data['vacancies']} Vacancies | Closing: {schema['applicationStatus']}")
        added_jobs.append({
            "id": schema["id"],
            "title": raw_data["title"],
            "board": raw_data["board"],
            "vacancies": raw_data["vacancies"],
            "closing": raw_data["summaryLastDate"],
            "link": raw_data["urls"][0]["url"] if raw_data["urls"] else ""
        })

        safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})

        # Periodic Git commit & push every 10 added jobs
        if added_jobs_count > 0 and added_jobs_count % 10 == 0:
            print(f"\n🚀 [MILESTONE] Reached {added_jobs_count} added jobs! Triggering build and commit...")
            
            # 1. Build
            print("  -> Running npm run build...")
            b_ok, b_out, b_err = run_cmd([NPM_CMD, "run", "build"])
            if not b_ok:
                print(f"  [BUILD WARNING/ERROR]: {b_err[:300]}")
            else:
                print("  -> Build successful!")

            # 2. Git add, commit, push
            print("  -> Git staging, committing, and pushing...")
            run_cmd([GIT_PATH, "add", "."])
            run_cmd([GIT_PATH, "commit", "-m", f"feat(jobs): batch add 10 vacancies from official portals (total: {added_jobs_count})"])
            p_ok, p_out, p_err = run_cmd([GIT_PATH, "push", "origin", "main"])
            if p_ok:
                print("  -> Successfully pushed to GitHub main branch!\n")
            else:
                print(f"  -> Push output: {p_out} {p_err}\n")

    print("\n================================================================")
    print("         ALL URLS PROCESSED - FINALIZING PIPELINE               ")
    print("================================================================")
    print(f"Total Added Jobs: {added_jobs_count}")
    print(f"Total Skipped Jobs: {len(skipped_jobs)}")

    # 1. Regenerate sitemap
    print("\n[1/3] Regenerating Sitemap & RSS Feeds...")
    s_ok, s_out, s_err = run_cmd([NPX_CMD, "tsx", "scripts/generate-sitemap.ts"])
    print(s_out if s_ok else f"Sitemap error: {s_err}")

    # 2. Production build
    print("\n[2/3] Running final Production Build...")
    b_ok, b_out, b_err = run_cmd([NPM_CMD, "run", "build"])
    if not b_ok:
        print(f"Final Build Error: {b_err[:400]}")
    else:
        print("Final build completed successfully!")

    # 3. Final Git Push
    print("\n[3/3] Final Git Commit & Push...")
    run_cmd([GIT_PATH, "add", "."])
    _, st_out, _ = run_cmd([GIT_PATH, "status", "--porcelain"])
    if st_out.strip():
        run_cmd([GIT_PATH, "commit", "-m", f"feat(jobs): update sitemap and final batch add remaining vacancies from official portals (total added: {added_jobs_count})"])
        p_ok, p_out, p_err = run_cmd([GIT_PATH, "push", "origin", "main"])
        if p_ok:
            print("Final push succeeded!")
        else:
            print(f"Final push output: {p_out} {p_err}")
    else:
        print("Working directory clean, nothing new to commit.")

    # Save summary report
    results_path = os.path.join(PROJECT_ROOT, "scripts", "batch_url_results.json")
    summary_report = {
        "timestamp": datetime.datetime.now().isoformat(),
        "total_urls_processed": len(unique_urls),
        "total_added": added_jobs_count,
        "total_skipped": len(skipped_jobs),
        "added_jobs": added_jobs,
        "skipped_jobs": skipped_jobs
    }
    safe_write_json(results_path, summary_report)
    safe_write_json(os.path.join(PROJECT_ROOT, "scratch", "batch_summary_report.json"), summary_report)
    print(f"\nBatch URL Vacancy Adder completed successfully! Summary saved to {results_path}")

if __name__ == "__main__":
    main()
