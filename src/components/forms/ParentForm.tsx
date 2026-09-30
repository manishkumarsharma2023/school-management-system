"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { createParent, updateParent } from "@/lib/actions";

export default function ParentForm({ type, data, setOpen }: { type: "create" | "update"; data?: any; setOpen: (v: boolean) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ParentSchema>({ resolver: zodResolver(parentSchema) });
  const [state, formAction] = useFormState(type === "create" ? createParent : updateParent, { success: false, error: false });
  const router = useRouter();
  useEffect(() => { if (state.success) { toast(`Parent has been ${type === "create" ? "created" : "updated"}!`); setOpen(false); router.refresh(); } }, [state, type, setOpen, router]);
  const submit = handleSubmit((values) => formAction(values));
  return <form onSubmit={submit} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2"><h1 className="text-xl font-semibold">{type === "create" ? "Create a new parent" : "Update parent"}</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors.username}/><InputField label="Password" name="password" type="password" register={register} error={errors.password}/><InputField label="First Name" name="name" defaultValue={data?.name} register={register} error={errors.name}/><InputField label="Last Name" name="surname" defaultValue={data?.surname} register={register} error={errors.surname}/><InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors.email}/><InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone}/><InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address}/>{data && <InputField label="Id" name="id" defaultValue={data.id} register={register} hidden error={errors.id}/>}</div>{state.error && <p className="text-sm text-red-500">Could not save parent. Check username/email/phone uniqueness and required fields.</p>}<button className="bg-blue-500 text-white rounded-md p-2">{type === "create" ? "Create" : "Update"}</button></form>;
}
