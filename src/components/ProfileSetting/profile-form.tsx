"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileFormSchema } from "@/schemas/FormsValidation";
import { useContextConsumer } from "@/context/Context";
import { useEffect, useState } from "react";
import {
  useGetUSerProfile,
  useUpdateUserProfile,
} from "@/hooks/apis/useUserAuth";
import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import LabelInputContainer from "../Forms/LabelInputContainer";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/PhoneInput";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pakistanData } from "@/constant/data";
import { cn } from "@/lib/utils";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { token } = useContextConsumer();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
  const [tehsilOptions, setTehsilOptions] = useState<Option[]>([]);
  const { data: session } = useSession();

  const { data: apiUser, isLoading } = useGetUSerProfile(token);

  const { mutate: updateUser, isPending: updating } = useUpdateUserProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      organization: "",
      countryCode: "",
      phone: "",
      province: "",
      district: "",
      tehsil: "",
      description: "",
      address: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        phone: "",
      });
    } else if (apiUser?.success && apiUser.data) {
      form.reset({
        name: apiUser.data.name || "",
        organization: apiUser.data.organization || "",
        phone: apiUser.data.phone || "",
        province: apiUser.data.province || "",
        district: apiUser.data.district || "",
        tehsil: apiUser.data.tehsil || "",
        description: apiUser.data.description || "",
        address: apiUser.data.address || "",
      });
    }
  }, [session, apiUser, form]);

  const handleProvinceChange = (value: string) => {
    const districts = pakistanData[`districts_${value}`] || [];
    setDistrictOptions(districts as any);
    setTehsilOptions([]);
  };

  const handleDistrictChange = (value: string) => {
    const tehsils = pakistanData[`tehsils_${value}`] || [];
    setTehsilOptions(tehsils as any);
  };

  function onSubmit(data: ProfileFormValues) {
    updateUser(
      { data, token },
      {
        onSuccess: () => {
          setIsEditable(false);
        },
      }
    );
  }

  console.log(apiUser, "apiUserapiUser");

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          type="button"
          onClick={() => setIsEditable(!isEditable)}
          className="py-2 px-4"
        >
          {isEditable ? "Cancel" : "Edit"}
          {!isEditable && <Pencil className="w-3.5 h-3.5 ml-2" />}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          <LabelInputContainer>
            <Label htmlFor="name" className="dark:text-farmacieGrey">
              Full Name
            </Label>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      type="text"
                      id="name"
                      className="outline-none focus:border-primary py-5"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="organization" className="dark:text-farmacieGrey">
              Organization
            </Label>
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Organization"
                      type="text"
                      id="organization"
                      className="outline-none focus:border-primary py-5"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="phone">Phone Number</Label>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput
                      id="phone"
                      placeholder="Enter your phone number"
                      defaultCountry="PK"
                      className="focus:border-none"
                      disabled={!isEditable}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="province" className="dark:text-farmacieGrey">
              Province
            </Label>
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        handleProvinceChange(value);
                        field.onChange(value);
                      }}
                      disabled={!isEditable}
                    >
                      <SelectTrigger
                        className={cn(
                          "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20",
                          !field.value
                            ? "dark:text-farmaciePlaceholderMuted"
                            : "dark:text-farmacieWhite"
                        )}
                      >
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          <SelectLabel>Select Province</SelectLabel>
                          {pakistanData.provinces.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="district" className="dark:text-farmacieGrey">
              District
            </Label>
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        handleDistrictChange(value);
                        field.onChange(value);
                      }}
                      disabled={!isEditable}
                    >
                      <SelectTrigger
                        className={cn(
                          "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20",
                          !field.value
                            ? "dark:text-farmaciePlaceholderMuted"
                            : "dark:text-farmacieWhite"
                        )}
                      >
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          <SelectLabel>Select District</SelectLabel>
                          {districtOptions.map((district) => (
                            <SelectItem
                              key={district.value}
                              value={district.value}
                            >
                              {district.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="tehsil" className="dark:text-farmacieGrey">
              Tehsil
            </Label>
            <FormField
              control={form.control}
              name="tehsil"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={!isEditable}
                    >
                      <SelectTrigger
                        className={cn(
                          "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20",
                          !field.value
                            ? "dark:text-farmaciePlaceholderMuted"
                            : "dark:text-farmacieWhite"
                        )}
                      >
                        <SelectValue placeholder="Select Tehsil" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          <SelectLabel>Select Tehsil</SelectLabel>
                          {tehsilOptions.map((tehsil) => (
                            <SelectItem key={tehsil.value} value={tehsil.value}>
                              {tehsil.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="description" className="dark:text-farmacieGrey">
              Description
            </Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your description ..."
                      rows={4}
                      id="description"
                      className="outline-none focus:border-primary"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="address" className="dark:text-farmacieGrey">
              Address
            </Label>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your address ..."
                      rows={4}
                      id="address"
                      className="outline-none focus:border-primary"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          {isEditable && (
            <div className="flex justify-end">
              <Button type="submit">
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
