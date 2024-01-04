import {
  getUnitList,
  devGroupList,
  mattersProgrammeList,
  mattersProgrammeListPage,
} from "@/api/device";

const params = {
  obj: {},
  page: 1,
  size: 100,
};

// 获取设备单位列表
export async function getUnitListUtils(obj = {}) {
  const supList: any = []
  params.obj = obj
  await getUnitList(params).then((res) => {
    if (res.code === "200") {
      res.rows.map((item) => {
        item.label = item.fullName;
        item.value = item.id;
        supList.push(item);
      });
    }
  });
  return supList
}
// 设备分组列表
export async function devGroupListUtils() {
  const supList: any = []
  await devGroupList(params).then((res: any) => {
    if (res.code === "200") {
      res.data.map((item: any) => {
        item.label = item.groupName;
        item.value = item.id;
        supList.push(item);
      });
    }
  });
  return supList
}

// 方案列表
export async function mattersProgrammeListPageUtils() {
  const matList: any = []
  await mattersProgrammeListPage(params).then((res) => {
    if (res.code === "200") {
      res.rows.map((item) => {
        item.label = item.programmeName;
        item.value = item.id;
        matList.push(item);
      });
    }
  });
  return matList
};

// 获取单位列表
// const getUnitListFun = async () => {
//   const params = {
//     obj: {},
//     page: 1,
//     size: 10,
//   };
//   await getUnitList(params).then((res) => {
//     if (res.code === "200") {
//       res.rows.map((item) => {
//         item.label = item.fullName;
//         item.value = item.id;
//         supList.push(item);
//       });
//     }
//   });
// };



// const devGroupListFun = () => {
//   const params = {
//     obj: {},
//     page: 1,
//     size: 10,
//   };
//   devGroupList(params).then((res: any) => {
//     if (res.code === "200") {
//       res.data.map((item: any) => {
//         item.label = item.groupName;
//         item.value = item.id;
//         gupList.push(item);
//       });
//     }
//   });
// };

