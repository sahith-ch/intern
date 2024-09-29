import { auth } from "@/auth";
import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { RiArrowDropUpFill } from "react-icons/ri";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
     <div className="flex w-full flex-col">
                <hr className="border-t w-full border-gray-200 flex-grow" />
                <div className="flex w-full pl-[25vw] pr-[25vw] p-2 justify-evenly items-center">
                    <div className="flex flex-col justify-center items-center">
                        <div className="rounded-full border-2 p-2 border-black">
                            <BsPersonCircle size={40} />
                        </div>
                        <div className="h-10">
                            {0 && <RiArrowDropUpFill size={40} />}
                        </div>
                    </div>
                    <hr className="border-t pb-10 border-gray-600 flex-grow" />
                    <div className="flex flex-col justify-center items-center">
                        <div className="rounded-full border-2 p-2 border-black">
                            <FaUserDoctor size={40} />
                        </div>
                        <div className="h-10">
                            { 1 && <RiArrowDropUpFill size={40} />}
                        </div>
                    </div>
                </div>
                <hr className="w-full border-gray-200 flex-grow" />
            </div>
            <div className="flex p-10 justify-center">
                <h1 className="font-bold text-2xl">Personalize Your Profile</h1>
            </div>
            {children}
   </>
  );
}