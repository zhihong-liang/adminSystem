import {
  mattersThemeInfoList,
} from "@/api/matter";

// 获取设备单位列表
export async function getMattersThemeInfoList() {
  const supList: any = []
  await mattersThemeInfoList({}).then((res) => {
    if (res.code === "200") {
      res.data.map((item: any) => {
        item.label = item.themeName;
        item.value = item.id;
        supList.push(item);
      });
    }
  });
  return supList
}
