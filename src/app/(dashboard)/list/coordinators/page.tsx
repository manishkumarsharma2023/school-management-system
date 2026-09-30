import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export default async function CoordinatorsPage({ searchParams }: { searchParams: { [key:string]: string|undefined } }) {
  const { sessionClaims } = auth();
  const role=(sessionClaims?.metadata as {role?:string})?.role;
  const { page, ...params }=searchParams; const p=page?Math.max(1,Number(page)):1;
  const query: Prisma.CoordinatorWhereInput={}; if(params.search) query.OR=[{name:{contains:params.search,mode:"insensitive"}},{surname:{contains:params.search,mode:"insensitive"}},{username:{contains:params.search,mode:"insensitive"}}];
  const [data,count]=await prisma.$transaction([prisma.coordinator.findMany({where:query,orderBy:{createdAt:"desc"},take:ITEM_PER_PAGE,skip:ITEM_PER_PAGE*(p-1)}),prisma.coordinator.count({where:query})]);
  const columns=[{header:"Info",accessor:"info"},{header:"Username",accessor:"username"},{header:"Email",accessor:"email",className:"hidden md:table-cell"},{header:"Phone",accessor:"phone",className:"hidden lg:table-cell"},{header:"Actions",accessor:"action"}];
  const renderRow=(item:any)=><tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm"><td className="p-4 font-medium">{item.name} {item.surname}</td><td>{item.username}</td><td className="hidden md:table-cell">{item.email||"—"}</td><td className="hidden lg:table-cell">{item.phone||"—"}</td><td><div className="flex gap-2">{role==="admin"&&<><FormContainer table="coordinator" type="update" data={item} /><FormContainer table="coordinator" type="delete" id={item.id} /></>}</div></td></tr>;
  return <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0"><div className="flex items-center justify-between mb-4"><h1 className="text-lg font-semibold">Coordinators</h1><TableSearch/><FormContainer table="coordinator" type="create" /></div><Table columns={columns} renderRow={renderRow} data={data as any}/><Pagination page={p} count={count}/></div>;
}
