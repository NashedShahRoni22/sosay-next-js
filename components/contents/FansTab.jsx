"use client";

import React from "react";
import ContentDashboard from "./ContentDashboard";
import MyFans from "./MyFans";

export default function FansTab({ accessToken, userInfo }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <ContentDashboard accessToken={accessToken} userInfo={userInfo} />
      <MyFans accessToken={accessToken} />
    </div>
  );
}
