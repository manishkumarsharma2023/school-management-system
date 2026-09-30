export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/coordinator(.*)": ["coordinator"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
  "/list/coordinators": ["admin"],
  "/list/teachers": ["admin", "coordinator", "teacher"],
  "/list/students": ["admin", "coordinator", "teacher"],
  "/list/parents": ["admin", "coordinator", "teacher"],
  "/list/subjects": ["admin", "coordinator"],
  "/list/classes": ["admin", "coordinator", "teacher"],
  "/list/lessons": ["admin", "coordinator", "teacher"],
  "/list/exams": ["admin", "coordinator", "teacher", "student", "parent"],
  "/list/assignments": ["admin", "coordinator", "teacher", "student", "parent"],
  "/list/results": ["admin", "coordinator", "teacher", "student", "parent"],
  "/list/attendance": ["admin", "coordinator", "teacher", "student", "parent"],
  "/profile(.*)": ["admin", "coordinator", "teacher", "student", "parent"],
  "/settings(.*)": ["admin", "coordinator", "teacher", "student", "parent"],
  "/messages(.*)": ["admin", "coordinator", "teacher", "student", "parent"],
  "/list/events": ["admin", "coordinator", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "coordinator", "teacher", "student", "parent"],
};