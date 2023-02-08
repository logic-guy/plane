import React from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// react-hook-form
import { Control, Controller } from "react-hook-form";
// services
import stateService from "services/state.service";
// ui
import { Spinner, CustomSelect } from "components/ui";
// icons
import { Squares2X2Icon } from "@heroicons/react/24/outline";
// helpers
import { getStatesList } from "helpers/state.helper";
// types
import { IIssue, UserAuth } from "types";
// constants
import { STATE_LIST } from "constants/fetch-keys";

type Props = {
  control: Control<IIssue, any>;
  submitChanges: (formData: Partial<IIssue>) => void;
  userAuth: UserAuth;
};

export const SidebarStateSelect: React.FC<Props> = ({ control, submitChanges, userAuth }) => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { data: stateGroups } = useSWR(
    workspaceSlug && projectId ? STATE_LIST(projectId as string) : null,
    workspaceSlug && projectId
      ? () => stateService.getStates(workspaceSlug as string, projectId as string)
      : null
  );
  const states = getStatesList(stateGroups ?? {});

  const isNotAllowed = userAuth.isGuest || userAuth.isViewer;

  return (
    <div className="flex flex-wrap items-center py-2">
      <div className="flex items-center gap-x-2 text-sm sm:basis-1/2">
        <Squares2X2Icon className="h-4 w-4 flex-shrink-0" />
        <p>State</p>
      </div>
      <div className="sm:basis-1/2">
        <Controller
          control={control}
          name="state"
          render={({ field: { value } }) => (
            <CustomSelect
              label={
                <span
                  className={`flex items-center gap-2 text-left ${value ? "" : "text-gray-900"}`}
                >
                  {value ? (
                    <>
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor: states?.find((option) => option.id === value)?.color,
                        }}
                      />
                      {states?.find((option) => option.id === value)?.name}
                    </>
                  ) : (
                    "None"
                  )}
                </span>
              }
              value={value}
              onChange={(value: any) => {
                submitChanges({ state: value });
              }}
              disabled={isNotAllowed}
            >
              {states ? (
                states.length > 0 ? (
                  states.map((option) => (
                    <CustomSelect.Option key={option.id} value={option.id}>
                      <>
                        {option.color && (
                          <span
                            className="h-2 w-2 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        {option.name}
                      </>
                    </CustomSelect.Option>
                  ))
                ) : (
                  <div className="text-center">No states found</div>
                )
              ) : (
                <Spinner />
              )}
            </CustomSelect>
          )}
        />
      </div>
    </div>
  );
};
