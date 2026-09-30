
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  coordinatorSchema,
  CoordinatorSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createCoordinator, updateCoordinator } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CoordinatorForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoordinatorSchema>({
    resolver: zodResolver(coordinatorSchema),
  });

  const [state, formAction] = useFormState(type === "create" ? createCoordinator : updateCoordinator, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Coordinator has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }

    if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, router, setOpen, type]);

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new Coordinator"
          : "Update Coordinator"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          defaultValue={data?.username}
          error={errors.username}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
        />
        {data && <InputField label="Id" name="id" defaultValue={data.id} register={register} hidden error={errors.id} />}
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          register={register}
          defaultValue={data?.name}
          error={errors.name}
        />

        <InputField
          label="Last Name"
          name="surname"
          register={register}
          defaultValue={data?.surname}
          error={errors.surname}
        />

        <InputField
          label="Email"
          name="email"
          register={register}
          defaultValue={data?.email}
          error={errors.email}
        />

        <InputField
          label="Phone"
          name="phone"
          register={register}
          defaultValue={data?.phone}
          error={errors.phone}
        />
      </div>

      {state.error && (
        <span className="text-red-500 text-sm">
          Something went wrong while saving the coordinator.
        </span>
      )}

      <button className="bg-lamaSky text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default CoordinatorForm;