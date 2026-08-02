export interface ExamData {
  id: string;
  exam: string;
  conductingBody: string;
  approxApplicants: string;
  expectedNotification: string;
}

export interface Notification {
  id: string;
  title: string;
  department: string;
  post_name: string;
  vacancies: string;
  qualification: string;
  age_limit: string;
  application_start: string;
  application_end: string;
  notification_pdf: string;
  apply_link: string;
  created_at: string;
  updated_at: string;
}
