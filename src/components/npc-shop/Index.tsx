"use client";

import React, { useEffect, useState } from "react";

import SelectOptions from "./SelectOptions";
import TabMenuIndex from "./Tab/TabIndex";
import Loading from "../shared/Loading";

import convertToKoreanTime from "@/utils/convertToKoreanTime";
import { serverMap } from "@/utils/serverMap";

import { useNpcShopLists } from "@/hooks/npcShop/useNpcShopLists";

export default function NpcShopIndex({ params }: { params: { server: string } }) {
  const [npcName, setNpcName] = useState("델");
  const [channel, setChannel] = useState("1");
  const [tabNumber, setTabNumber] = useState(0);

  useEffect(() => {
    setTabNumber(0);
  }, [npcName, channel]);

  const { data, isFetching } = useNpcShopLists(params, npcName, channel);

  return (
    <section className="text-[12px] md:text-[14px]">
      <h3 className="text-[18px] text-center font-bold pb-6">{serverMap[params.server]}서버 NPC 상점</h3>

      <div className="flex gap-1 flex-col justify-center items-center w-full">
        <SelectOptions setNpcName={setNpcName} setChannel={setChannel} />
        <div className="text-[12px] md:text-[14px]">
          <UpdateTime data={data} title="기준" />
          <UpdateTime data={data} title="갱신" />
        </div>

        <div className="divider m-0"></div>

        {isFetching && <Loading />}

        {data?.error?.name === "OPENAPI00009" && <div className="mt-3">API 서버에서 데이터를 갱신중입니다.</div>}
        {data && data?.shop && !data.error && (
          <TabMenuIndex data={data} tabNumber={tabNumber} setTabNumber={setTabNumber} />
        )}
      </div>
    </section>
  );
}

function UpdateTime({ data, title }: { data: NpcTypes; title: string }) {
  return (
    <div className="flex items-center">
      {title}:&nbsp;
      {data && !data.error ? (
        <>
          {convertToKoreanTime(data.date_inquire).formattedDate}&nbsp;
          {convertToKoreanTime(data.date_inquire).formattedTime}
        </>
      ) : (
        <div className="skeleton h-4 w-40"></div>
      )}
    </div>
  );
}
