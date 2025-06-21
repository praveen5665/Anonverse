import React from "react";
import { Button } from "@/components/ui/button";

const PostFilter = ({
  timeFilter,
  sortFilter,
  onTimeFilterChange,
  onSortFilterChange,
  showTimeFilter = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {showTimeFilter && (
        <div className="flex gap-2 mb-4 border-b pb-2">
          <Button
            variant={timeFilter === "today" ? "default" : "ghost"}
            onClick={() => onTimeFilterChange("today")}
          >
            Today
          </Button>
          <Button
            variant={timeFilter === "week" ? "default" : "ghost"}
            onClick={() => onTimeFilterChange("week")}
          >
            This Week
          </Button>
          <Button
            variant={timeFilter === "month" ? "default" : "ghost"}
            onClick={() => onTimeFilterChange("month")}
          >
            This Month
          </Button>
          <Button
            variant={timeFilter === "all" ? "default" : "ghost"}
            onClick={() => onTimeFilterChange("all")}
          >
            All Time
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant={sortFilter === "hot" ? "default" : "ghost"}
          onClick={() => onSortFilterChange("hot")}
          size="sm"
        >
          Hot
        </Button>
        <Button
          variant={sortFilter === "new" ? "default" : "ghost"}
          onClick={() => onSortFilterChange("new")}
          size="sm"
        >
          New
        </Button>
        <Button
          variant={sortFilter === "top" ? "default" : "ghost"}
          onClick={() => onSortFilterChange("top")}
          size="sm"
        >
          Top
        </Button>
      </div>
    </div>
  );
};

export default PostFilter;
