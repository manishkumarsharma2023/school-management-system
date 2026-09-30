"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { requireRole } from "./auth";
import {
  AssignmentSchema,
  AttendanceSchema,
  AnnouncementSchema,
  ClassSchema,
  CoordinatorSchema,
  EventSchema,
  ExamSchema,
  LessonSchema,
  ParentSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";

type CurrentState = { success: boolean; error: boolean; message?: string };
const ok = () => ({ success: true, error: false });
const fail = (message?: string) => ({ success: false, error: true, message });

async function cleanupClerkUser(id: string | null) {
  if (!id) return;
  try { await clerkClient.users.deleteUser(id); } catch (error) { console.error("CLERK CLEANUP ERROR", error); }
}

export async function createSubject(_: CurrentState, data: SubjectSchema) {
  try { requireRole(["admin", "coordinator"]); await prisma.subject.create({ data: { name: data.name, teachers: { connect: data.teachers.map(id => ({ id })) } } }); return ok(); }
  catch (e) { console.error(e); return fail(); }
}
export async function updateSubject(_: CurrentState, data: SubjectSchema) {
  try { requireRole(["admin", "coordinator"]); await prisma.subject.update({ where: { id: data.id }, data: { name: data.name, teachers: { set: data.teachers.map(id => ({ id })) } } }); return ok(); }
  catch (e) { console.error(e); return fail(); }
}
export async function deleteSubject(_: CurrentState, data: FormData) {
  try { requireRole(["admin", "coordinator"]); await prisma.subject.delete({ where: { id: Number(data.get("id")) } }); return ok(); }
  catch (e) { console.error(e); return fail(); }
}

export async function createClass(_: CurrentState, data: ClassSchema) {
  try { requireRole(["admin", "coordinator"]); await prisma.class.create({ data }); return ok(); }
  catch (e) { console.error(e); return fail(); }
}
export async function updateClass(_: CurrentState, data: ClassSchema) {
  try { requireRole(["admin", "coordinator"]); await prisma.class.update({ where: { id: data.id }, data }); return ok(); }
  catch (e) { console.error(e); return fail(); }
}
export async function deleteClass(_: CurrentState, data: FormData) {
  try { requireRole(["admin", "coordinator"]); await prisma.class.delete({ where: { id: Number(data.get("id")) } }); return ok(); }
  catch (e) { console.error(e); return fail(); }
}

export async function createCoordinator(_: CurrentState, data: CoordinatorSchema) {
  requireRole(["admin"]);
  let clerkUserId: string | null = null;
  try {
    const user = await clerkClient.users.createUser({ username: data.username, password: data.password, firstName: data.name, lastName: data.surname, ...(data.email ? { emailAddress: [data.email] } : {}), publicMetadata: { role: "coordinator" } });
    clerkUserId = user.id;
    await prisma.coordinator.create({ data: { id: user.id, username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone || null } });
    return ok();
  } catch (e) { console.error(e); await cleanupClerkUser(clerkUserId); return fail(); }
}
export async function updateCoordinator(_: CurrentState, data: CoordinatorSchema) {
  requireRole(["admin"]);
  if (!data.id) return fail("Missing coordinator id");
  try {
    await clerkClient.users.updateUser(data.id, { username: data.username, ...(data.password ? { password: data.password } : {}), firstName: data.name, lastName: data.surname });
    await prisma.coordinator.update({ where: { id: data.id }, data: { username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone || null } });
    return ok();
  } catch (e) { console.error(e); return fail(); }
}
export async function deleteCoordinator(_: CurrentState, data: FormData) {
  requireRole(["admin"]);
  const id = String(data.get("id"));
  try { await prisma.coordinator.delete({ where: { id } }); await cleanupClerkUser(id); return ok(); }
  catch (e) { console.error(e); return fail(); }
}

export async function createTeacher(_: CurrentState, data: TeacherSchema) {
  requireRole(["admin", "coordinator"]);
  let clerkUserId: string | null = null;
  try {
    const user = await clerkClient.users.createUser({ username: data.username, password: data.password, firstName: data.name, lastName: data.surname, ...(data.email ? { emailAddress: [data.email] } : {}), publicMetadata: { role: "teacher" } });
    clerkUserId = user.id;
    await prisma.teacher.create({ data: { id: user.id, username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone || null, address: data.address, img: data.img || null, bloodType: data.bloodType, sex: data.sex, birthday: data.birthday, subjects: { connect: (data.subjects || []).map(id => ({ id: Number(id) })) }, classes: { connect: (data.classes || []).map(id => ({ id: Number(id) })) } } });
    return ok();
  } catch (e) { console.error(e); await cleanupClerkUser(clerkUserId); return fail(); }
}
export async function updateTeacher(_: CurrentState, data: TeacherSchema) {
  requireRole(["admin", "coordinator"]); if (!data.id) return fail("Missing teacher id");
  try {
    await clerkClient.users.updateUser(data.id, { username: data.username, ...(data.password ? { password: data.password } : {}), firstName: data.name, lastName: data.surname });
    await prisma.teacher.update({ where: { id: data.id }, data: { username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone || null, address: data.address, img: data.img || null, bloodType: data.bloodType, sex: data.sex, birthday: data.birthday, subjects: { set: (data.subjects || []).map(id => ({ id: Number(id) })) }, classes: { set: (data.classes || []).map(id => ({ id: Number(id) })) } } });
    return ok();
  } catch (e) { console.error(e); return fail(); }
}
export async function deleteTeacher(_: CurrentState, data: FormData) {
  requireRole(["admin", "coordinator"]); const id = String(data.get("id"));
  try { await prisma.teacher.delete({ where: { id } }); await cleanupClerkUser(id); return ok(); }
  catch (e) { console.error(e); return fail(); }
}

export async function createParent(_: CurrentState, data: ParentSchema) {
  requireRole(["admin", "coordinator"]); let clerkUserId: string | null = null;
  try {
    const user = await clerkClient.users.createUser({ username: data.username, password: data.password, firstName: data.name, lastName: data.surname, ...(data.email ? { emailAddress: [data.email] } : {}), publicMetadata: { role: "parent" } });
    clerkUserId = user.id;
    await prisma.parent.create({ data: { id: user.id, username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone, address: data.address } });
    return ok();
  } catch (e) { console.error(e); await cleanupClerkUser(clerkUserId); return fail(); }
}
export async function updateParent(_: CurrentState, data: ParentSchema) {
  requireRole(["admin", "coordinator"]); if (!data.id) return fail("Missing parent id");
  try {
    await clerkClient.users.updateUser(data.id, { username: data.username, ...(data.password ? { password: data.password } : {}), firstName: data.name, lastName: data.surname });
    await prisma.parent.update({ where: { id: data.id }, data: { username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone, address: data.address } });
    return ok();
  } catch (e) { console.error(e); return fail(); }
}
export async function deleteParent(_: CurrentState, data: FormData) {
  requireRole(["admin", "coordinator"]); const id = String(data.get("id"));
  try { await prisma.parent.delete({ where: { id } }); await cleanupClerkUser(id); return ok(); }
  catch (e) { console.error(e); return fail(); }
}

export async function createStudent(_: CurrentState, data: StudentSchema) {
  requireRole(["admin", "coordinator"]); let clerkUserId: string | null = null;
  try {
    const classItem = await prisma.class.findUnique({ where: { id: data.classId }, include: { _count: { select: { students: true } } } });
    if (!classItem || classItem.capacity <= classItem._count.students) return fail("Class capacity reached");
    if (data.gradeId !== classItem.gradeId) return fail("Student grade and class grade must match");
    const parent = await prisma.parent.findUnique({ where: { id: data.parentId } }); if (!parent) return fail("Parent not found");
    const user = await clerkClient.users.createUser({ username: data.username, password: data.password, firstName: data.name, lastName: data.surname, ...(data.email ? { emailAddress: [data.email] } : {}), publicMetadata: { role: "student" } });
    clerkUserId = user.id;
    await prisma.student.create({ data: { id: user.id, username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone || null, address: data.address, img: data.img || null, bloodType: data.bloodType, sex: data.sex, birthday: data.birthday, gradeId: data.gradeId, classId: data.classId, parentId: data.parentId } });
    return ok();
  } catch (e) { console.error(e); await cleanupClerkUser(clerkUserId); return fail(); }
}
export async function updateStudent(_: CurrentState, data: StudentSchema) {
  requireRole(["admin", "coordinator"]); if (!data.id) return fail("Missing student id");
  try {
    const classItem = await prisma.class.findUnique({ where: { id: data.classId } }); if (!classItem || classItem.gradeId !== data.gradeId) return fail("Student grade and class grade must match");
    await clerkClient.users.updateUser(data.id, { username: data.username, ...(data.password ? { password: data.password } : {}), firstName: data.name, lastName: data.surname });
    await prisma.student.update({ where: { id: data.id }, data: { username: data.username, name: data.name, surname: data.surname, email: data.email || null, phone: data.phone || null, address: data.address, img: data.img || null, bloodType: data.bloodType, sex: data.sex, birthday: data.birthday, gradeId: data.gradeId, classId: data.classId, parentId: data.parentId } });
    return ok();
  } catch (e) { console.error(e); return fail(); }
}
export async function deleteStudent(_: CurrentState, data: FormData) {
  requireRole(["admin", "coordinator"]); const id = String(data.get("id"));
  try { await prisma.student.delete({ where: { id } }); await cleanupClerkUser(id); return ok(); }
  catch (e) { console.error(e); return fail(); }
}

async function teacherCanEditLesson(userId: string, role: string, lessonId: number) {
  if (role === "admin" || role === "coordinator") return true;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { teacherId: true } });
  return role === "teacher" && lesson?.teacherId === userId;
}

export async function createLesson(_: CurrentState, data: LessonSchema) {
  const { userId, role } = requireRole(["admin", "coordinator"]);
  try { await prisma.lesson.create({ data }); return ok(); } catch (e) { console.error(e); return fail(); }
}
export async function updateLesson(_: CurrentState, data: LessonSchema) {
  const { userId, role } = requireRole(["admin", "coordinator"]);
  if (!data.id) return fail("Missing lesson id");
  try { if (!(await teacherCanEditLesson(userId, role, data.id))) throw new Error("Unauthorized"); await prisma.lesson.update({ where: { id: data.id }, data }); return ok(); } catch (e) { console.error(e); return fail(); }
}
export async function deleteLesson(_: CurrentState, data: FormData) {
  requireRole(["admin", "coordinator"]); try { await prisma.lesson.delete({ where: { id: Number(data.get("id")) } }); return ok(); } catch (e) { console.error(e); return fail(); }
}

export async function createExam(_: CurrentState, data: ExamSchema) {
  const { userId, role } = requireRole(["admin", "coordinator", "teacher"]);
  try { if (role === "teacher" && !(await teacherCanEditLesson(userId, role, data.lessonId))) throw new Error("Unauthorized"); await prisma.exam.create({ data: { title: data.title, startTime: data.startTime, endTime: data.endTime, lessonId: data.lessonId } }); return ok(); } catch (e) { console.error(e); return fail(); }
}
export async function updateExam(_: CurrentState, data: ExamSchema) {
  const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); if (!data.id) return fail("Missing exam id");
  try { const exam = await prisma.exam.findUnique({ where: { id: data.id }, select: { lessonId: true } }); if (!exam || !(await teacherCanEditLesson(userId, role, exam.lessonId))) throw new Error("Unauthorized"); await prisma.exam.update({ where: { id: data.id }, data: { title: data.title, startTime: data.startTime, endTime: data.endTime, lessonId: data.lessonId } }); return ok(); } catch (e) { console.error(e); return fail(); }
}
export async function deleteExam(_: CurrentState, data: FormData) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); try { const exam = await prisma.exam.findUnique({ where: { id: Number(data.get("id")) }, select: { lessonId: true } }); if (!exam || !(await teacherCanEditLesson(userId, role, exam.lessonId))) throw new Error("Unauthorized"); await prisma.exam.delete({ where: { id: Number(data.get("id")) } }); return ok(); } catch (e) { console.error(e); return fail(); } }

export async function createAssignment(_: CurrentState, data: AssignmentSchema) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); try { if (!(role === "admin" || role === "coordinator") && !(await teacherCanEditLesson(userId, role, data.lessonId))) throw new Error("Unauthorized"); await prisma.assignment.create({ data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function updateAssignment(_: CurrentState, data: AssignmentSchema) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); if (!data.id) return fail(); try { const item = await prisma.assignment.findUnique({ where: { id: data.id }, select: { lessonId: true } }); if (!item || !(role === "admin" || role === "coordinator" || await teacherCanEditLesson(userId, role, item.lessonId))) throw new Error("Unauthorized"); await prisma.assignment.update({ where: { id: data.id }, data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function deleteAssignment(_: CurrentState, data: FormData) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); try { const id = Number(data.get("id")); const item = await prisma.assignment.findUnique({ where: { id }, select: { lessonId: true } }); if (!item || !(role === "admin" || role === "coordinator" || await teacherCanEditLesson(userId, role, item.lessonId))) throw new Error("Unauthorized"); await prisma.assignment.delete({ where: { id } }); return ok(); } catch (e) { console.error(e); return fail(); } }

export async function createResult(_: CurrentState, data: ResultSchema) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); try { const target = data.examId ? await prisma.exam.findUnique({ where: { id: data.examId }, select: { lessonId: true } }) : await prisma.assignment.findUnique({ where: { id: data.assignmentId! }, select: { lessonId: true } }); if (!target || !(role === "admin" || role === "coordinator" || await teacherCanEditLesson(userId, role, target.lessonId))) throw new Error("Unauthorized"); await prisma.result.create({ data: { score: data.score, studentId: data.studentId, ...(data.examId ? { examId: data.examId } : { assignmentId: data.assignmentId }) } }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function updateResult(_: CurrentState, data: ResultSchema) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); if (!data.id) return fail(); try { const current = await prisma.result.findUnique({ where: { id: data.id }, select: { examId: true, assignmentId: true } }); if (!current) throw new Error("Result not found"); const lessonId = current.examId ? (await prisma.exam.findUnique({ where: { id: current.examId }, select: { lessonId: true } }))?.lessonId : (await prisma.assignment.findUnique({ where: { id: current.assignmentId! }, select: { lessonId: true } }))?.lessonId; if (!lessonId || !(role === "admin" || role === "coordinator" || await teacherCanEditLesson(userId, role, lessonId))) throw new Error("Unauthorized"); await prisma.result.update({ where: { id: data.id }, data: { score: data.score, studentId: data.studentId, examId: data.examId || null, assignmentId: data.assignmentId || null } }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function deleteResult(_: CurrentState, data: FormData) { const { userId, role } = requireRole(["admin", "coordinator", "teacher"]); try { const id = Number(data.get("id")); const item = await prisma.result.findUnique({ where: { id }, select: { examId: true, assignmentId: true } }); if (!item) throw new Error("Not found"); const lessonId = item.examId ? (await prisma.exam.findUnique({ where: { id: item.examId }, select: { lessonId: true } }))?.lessonId : (await prisma.assignment.findUnique({ where: { id: item.assignmentId! }, select: { lessonId: true } }))?.lessonId; if (!lessonId || !(role === "admin" || role === "coordinator" || await teacherCanEditLesson(userId, role, lessonId))) throw new Error("Unauthorized"); await prisma.result.delete({ where: { id } }); return ok(); } catch (e) { console.error(e); return fail(); } }

export async function createEvent(_: CurrentState, data: EventSchema) { requireRole(["admin", "coordinator"]); try { await prisma.event.create({ data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function updateEvent(_: CurrentState, data: EventSchema) { requireRole(["admin", "coordinator"]); if (!data.id) return fail(); try { await prisma.event.update({ where: { id: data.id }, data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function deleteEvent(_: CurrentState, data: FormData) { requireRole(["admin", "coordinator"]); try { await prisma.event.delete({ where: { id: Number(data.get("id")) } }); return ok(); } catch (e) { console.error(e); return fail(); } }

export async function createAnnouncement(_: CurrentState, data: AnnouncementSchema) { requireRole(["admin", "coordinator"]); try { await prisma.announcement.create({ data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function updateAnnouncement(_: CurrentState, data: AnnouncementSchema) { requireRole(["admin", "coordinator"]); if (!data.id) return fail(); try { await prisma.announcement.update({ where: { id: data.id }, data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function deleteAnnouncement(_: CurrentState, data: FormData) { requireRole(["admin", "coordinator"]); try { await prisma.announcement.delete({ where: { id: Number(data.get("id")) } }); return ok(); } catch (e) { console.error(e); return fail(); } }

export async function createAttendance(_: CurrentState, data: AttendanceSchema) { requireRole(["admin", "coordinator", "teacher"]); try { await prisma.attendance.create({ data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function updateAttendance(_: CurrentState, data: AttendanceSchema) { requireRole(["admin", "coordinator", "teacher"]); if (!data.id) return fail(); try { await prisma.attendance.update({ where: { id: data.id }, data }); return ok(); } catch (e) { console.error(e); return fail(); } }
export async function deleteAttendance(_: CurrentState, data: FormData) { requireRole(["admin", "coordinator", "teacher"]); try { await prisma.attendance.delete({ where: { id: Number(data.get("id")) } }); return ok(); } catch (e) { console.error(e); return fail(); } }
