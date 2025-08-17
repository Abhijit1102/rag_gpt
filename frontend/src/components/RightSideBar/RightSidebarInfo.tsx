"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface InfoProps {
  info: Record<string, any> | null;
  isLoading?: boolean;
}

const getBadgeColor = (key: string, value: any) => {
  if (key.toLowerCase() === "status") {
    if (value === "green" || value === "active") return "bg-green-600 text-white";
    if (value === "red" || value === "inactive") return "bg-red-600 text-white";
    if (value === "yellow" || value === "pending") return "bg-yellow-500 text-black";
    return "bg-gray-800 text-white";
  }
  return "bg-gray-800 text-white";
};

export const RightSidebarInfo: FC<InfoProps> = ({ info, isLoading = false }) => {
  if (!info || isLoading) {
    return (
      <Card className="w-full bg-[#1A1A1A] text-white border border-gray-700 animate-pulse">
        <CardHeader>
          <CardTitle className="text-lg">
            <Skeleton className="h-5 w-32 bg-gray-700/60 rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-gray-700/60 rounded" />
              <Skeleton className="h-4 w-12 bg-gray-700/60 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#1A1A1A] text-white border border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(info).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-gray-400 capitalize">{key.replace(/_/g, " ")}</span>
            <Badge className={getBadgeColor(key, value)}>{String(value)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
