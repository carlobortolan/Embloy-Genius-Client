"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import Image from "next/image";
import { alpha_24 } from "@/lib/utils/formats";
import { cn } from "@/lib/utils";
import "./local.css";

export const AvatarButton = ({
  user,
  styles,
  w,
  h,
  updated_image,
  loading,
}) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(loading);
  }, [loading]);
  return (
    <button className={styles}>
      {showLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div
        style={{
          backgroundImage: `url(${cn(
            updated_image
              ? updated_image
              : user.image_url
              ? user.image_url
              : `/icons/${
                  alpha_24.includes(user.first_name.charAt(0).toLowerCase())
                    ? user.first_name.charAt(0).toUpperCase()
                    : "Slug"
                }.svg`
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "50%",
          width: `${Math.min(h, w)}px`,
          height: `${Math.min(h, w)}px`,
        }}
        className="rounded-full"
      />
    </button>
  );
};
