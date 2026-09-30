import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table: "coordinator" | "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  let relatedData: any = {};

  if (type !== "delete") {
    switch (table) {
      case "coordinator":
        break;
      case "subject":
        relatedData.teachers = await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } });
        break;
      case "class":
        relatedData.grades = await prisma.grade.findMany({ select: { id: true, level: true } });
        relatedData.teachers = await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } });
        break;
      case "teacher":
        relatedData.subjects = await prisma.subject.findMany({ select: { id: true, name: true } });
        relatedData.classes = await prisma.class.findMany({ select: { id: true, name: true } });
        break;
      case "student":
        relatedData.grades = await prisma.grade.findMany({ select: { id: true, level: true } });
        relatedData.classes = await prisma.class.findMany({ include: { _count: { select: { students: true } } } });
        relatedData.parents = await prisma.parent.findMany({ select: { id: true, name: true, surname: true } });
        break;
      case "lesson":
        relatedData.subjects = await prisma.subject.findMany({ select: { id: true, name: true } });
        relatedData.classes = await prisma.class.findMany({ select: { id: true, name: true } });
        relatedData.teachers = await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } });
        break;
      case "exam":
        relatedData.lessons = await prisma.lesson.findMany({ where: role === "teacher" ? { teacherId: userId! } : {}, select: { id: true, name: true, subject: { select: { name: true } }, class: { select: { name: true } } }, orderBy: { id: "desc" } });
        break;
      case "assignment":
        relatedData.lessons = await prisma.lesson.findMany({ where: role === "teacher" ? { teacherId: userId! } : {}, select: { id: true, name: true, subject: { select: { name: true } }, class: { select: { name: true } } }, orderBy: { id: "desc" } });
        break;
      case "result":
        relatedData.students = await prisma.student.findMany({ select: { id: true, name: true, surname: true }, orderBy: { name: "asc" } });
        relatedData.exams = await prisma.exam.findMany({ where: role === "teacher" ? { lesson: { teacherId: userId! } } : {}, select: { id: true, title: true }, orderBy: { startTime: "desc" } });
        relatedData.assignments = await prisma.assignment.findMany({ where: role === "teacher" ? { lesson: { teacherId: userId! } } : {}, select: { id: true, title: true }, orderBy: { dueDate: "desc" } });
        break;
      case "event":
      case "announcement":
        relatedData.classes = await prisma.class.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
        break;
      case "attendance":
        relatedData.students = await prisma.student.findMany({ select: { id: true, name: true, surname: true }, orderBy: { name: "asc" } });
        relatedData.lessons = await prisma.lesson.findMany({ where: role === "teacher" ? { teacherId: userId! } : {}, select: { id: true, name: true }, orderBy: { id: "desc" } });
        break;
    }
  }

  return <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />;
};
export default FormContainer;
