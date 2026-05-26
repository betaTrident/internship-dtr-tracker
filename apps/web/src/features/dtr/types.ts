export type Role = "intern" | "supervisor" | "admin"

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Half-day"
  | "Holiday"
  | "Excused"

export type WorkSetup = "WFH" | "Hybrid"

export type ApprovalStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "Needs Correction"

export type InternProfile = {
  id: string
  fullName: string
  studentId: string
  email: string
  contactNumber: string
  school: string
  course: string
  yearLevel: string
  company: string
  internRole: string
  supervisor: string
  supervisorTitle: string
  internshipStart: string
  internshipEnd: string
  requiredHours: number
  status: "Active" | "Completed" | "Inactive"
}

export type DtrEntry = {
  id: string
  internId: string
  date: string
  amIn: string
  amOut: string
  pmIn: string
  pmOut: string
  breakMinutes: number
  totalHours: number
  overtimeHours: number
  undertimeHours: number
  attendanceStatus: AttendanceStatus
  workSetup: WorkSetup
  internRemarks: string
  supervisorRemarks: string
  approvalStatus: ApprovalStatus
}

export type DtrForm = {
  date: string
  amIn: string
  amOut: string
  pmIn: string
  pmOut: string
  breakMinutes: string
  attendanceStatus: AttendanceStatus
  workSetup: WorkSetup
  internRemarks: string
}

export type SystemSettings = {
  systemTitle: string
  defaultShiftStart: string
  defaultShiftEnd: string
  defaultBreakMinutes: number
  dailyTargetHours: number
  exportFormats: string
}
