import { z } from "zod";

const optionalPassword = z.string().min(8, { message: "Password must be at least 8 characters long!" }).optional().or(z.literal(""));
const email = z.string().email({ message: "Invalid email address!" }).optional().or(z.literal(""));

export const subjectSchema = z.object({ id: z.coerce.number().optional(), name: z.string().min(1, "Subject name is required!"), teachers: z.array(z.string()).default([]) });
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({ id: z.coerce.number().optional(), name: z.string().min(1, "Class name is required!"), capacity: z.coerce.number().int().min(1, "Capacity must be at least 1!"), gradeId: z.coerce.number().int().min(1, "Grade is required!"), supervisorId: z.string().optional().transform(v => v === "" ? undefined : v) });
export type ClassSchema = z.infer<typeof classSchema>;

export const coordinatorSchema = z.object({ id: z.string().optional(), username: z.string().min(3).max(20), password: optionalPassword, name: z.string().min(1), surname: z.string().min(1), email, phone: z.string().optional() });
export type CoordinatorSchema = z.infer<typeof coordinatorSchema>;

export const teacherSchema = z.object({ id: z.string().optional(), username: z.string().min(3).max(20), password: optionalPassword, name: z.string().min(1), surname: z.string().min(1), email, phone: z.string().optional(), address: z.string().min(1), img: z.string().optional(), bloodType: z.string().min(1), birthday: z.coerce.date(), sex: z.enum(["MALE", "FEMALE"]), subjects: z.array(z.string()).default([]), classes: z.array(z.string()).default([]) });
export type TeacherSchema = z.infer<typeof teacherSchema>;

export const parentSchema = z.object({ id: z.string().optional(), username: z.string().min(3).max(20), password: optionalPassword, name: z.string().min(1), surname: z.string().min(1), email, phone: z.string().min(5), address: z.string().min(1) });
export type ParentSchema = z.infer<typeof parentSchema>;

export const studentSchema = z.object({ id: z.string().optional(), username: z.string().min(3).max(20), password: optionalPassword, name: z.string().min(1), surname: z.string().min(1), email, phone: z.string().optional(), address: z.string().min(1), img: z.string().optional(), bloodType: z.string().min(1), birthday: z.coerce.date(), sex: z.enum(["MALE", "FEMALE"]), gradeId: z.coerce.number().int().min(1), classId: z.coerce.number().int().min(1), parentId: z.string().min(1) });
export type StudentSchema = z.infer<typeof studentSchema>;

export const lessonSchema = z.object({ id: z.coerce.number().optional(), name: z.string().min(1), day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]), startTime: z.coerce.date(), endTime: z.coerce.date(), subjectId: z.coerce.number().int().min(1), classId: z.coerce.number().int().min(1), teacherId: z.string().min(1) }).refine(v => v.endTime > v.startTime, { message: "End time must be after start time", path: ["endTime"] });
export type LessonSchema = z.infer<typeof lessonSchema>;

export const examSchema = z.object({ id: z.coerce.number().optional(), title: z.string().min(1), startTime: z.coerce.date(), endTime: z.coerce.date(), lessonId: z.coerce.number().int().min(1) }).refine(v => v.endTime > v.startTime, { message: "End time must be after start time", path: ["endTime"] });
export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({ id: z.coerce.number().optional(), title: z.string().min(1), startDate: z.coerce.date(), dueDate: z.coerce.date(), lessonId: z.coerce.number().int().min(1) }).refine(v => v.dueDate >= v.startDate, { message: "Due date must be after start date", path: ["dueDate"] });
export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z.object({ id: z.coerce.number().optional(), score: z.coerce.number().int().min(0).max(100), studentId: z.string().min(1), examId: z.union([z.coerce.number().int().positive(), z.literal("")]).transform(v => v === "" ? undefined : v).optional(), assignmentId: z.union([z.coerce.number().int().positive(), z.literal("")]).transform(v => v === "" ? undefined : v).optional() }).refine(v => Boolean(v.examId) !== Boolean(v.assignmentId), { message: "Select either an exam or assignment", path: ["examId"] });
export type ResultSchema = z.infer<typeof resultSchema>;

export const eventSchema = z.object({ id: z.coerce.number().optional(), title: z.string().min(1), description: z.string().min(1), startTime: z.coerce.date(), endTime: z.coerce.date(), classId: z.union([z.coerce.number().int().positive(), z.literal("")]).transform(v => v === "" ? undefined : v).optional() }).refine(v => v.endTime > v.startTime, { message: "End time must be after start time", path: ["endTime"] });
export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({ id: z.coerce.number().optional(), title: z.string().min(1), description: z.string().min(1), date: z.coerce.date(), classId: z.union([z.coerce.number().int().positive(), z.literal("")]).transform(v => v === "" ? undefined : v).optional() });
export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const attendanceSchema = z.object({ id: z.coerce.number().optional(), date: z.coerce.date(), present: z.boolean(), studentId: z.string().min(1), lessonId: z.coerce.number().int().min(1) });
export type AttendanceSchema = z.infer<typeof attendanceSchema>;
