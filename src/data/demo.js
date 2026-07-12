// §6 演示页面的静态假数据（不接后端，仅用于 Demo 展示）。

// §6.0 身份等级（按累计贡献值）
export const LEVELS = [
  { name: '新手铲屎官', min: 0, max: 100, color: '#8FA3B0' },
  { name: '老铲屎官', min: 100, max: 500, color: '#3DBE82' },
  { name: '经验贡献者', min: 500, max: 2000, color: '#2E6FB7' },
  { name: '金牌铲屎官', min: 2000, max: Infinity, color: '#E0A33E' },
]

export function levelOf(points) {
  return LEVELS.find((l) => points >= l.min && points < l.max) ?? LEVELS[0]
}

export function nextLevelOf(points) {
  return LEVELS.find((l) => l.min > points) ?? null
}

// §6.0 贡献值获取规则
export const EARN_RULES = [
  { action: '回填结果（后来去了吗？兽医怎么说？）', score: '+10' },
  { action: '贡献一条经验', score: '+50' },
  { action: '经验被审核收录进知识库', score: '+200' },
  { action: '经验被其他用户标记「有帮助」', score: '+5 / 次' },
]

// §6.1 当前用户
export const CURRENT_USER = {
  nick: '花卷妈',
  points: 1240,
  contributed: 8, // 贡献经验条数
  recognized: 312, // 被认可次数
  helped: 486, // 帮助过多少人
  rank: 47, // 贡献榜排名
}

// §6.1 我贡献的经验（每条显示被认可次数）
export const MY_EXPERIENCES = [
  { tag: '换粮软便', body: '换粮头三天先按 3:7 掺着喂，软便基本能扛过去，别急着停食。', recognized: 96 },
  { tag: '猫藓', body: '发现一小块就赶紧隔离+剃毛上药，拖到扩散就得药浴一个月，费钱费猫。', recognized: 74 },
  { tag: '幼猫补水', body: '不肯喝水就用针管喂电解质水，一次 2ml，别硬灌呛到。', recognized: 58 },
]

// §6.2 经验广场
export const COMMUNITY = [
  { tag: '公猫尿闭', nick: '豆芽的铲屎官', points: 2400, body: '我家橘猫也是蹲砂盆没尿，当时半夜三点冲去医院，导尿+住院三天花了四千。医生说再晚六小时肾就伤了。别犹豫。', helpful: 238, earned: 1390 },
  { tag: '误食巧克力', nick: '可乐爸', points: 720, body: '狗偷吃了半块黑巧，赶紧催吐+送医打点滴。黑巧比牛奶巧克力毒得多，别赌它没事。', helpful: 156, earned: 810 },
  { tag: '猫应激拉稀', nick: '三三妈妈', points: 1180, body: '搬家后猫拉了两天软便但精神好，益生菌+安静环境养了三天就好了，没必要一有软便就往医院跑。', helpful: 92, earned: 470 },
  { tag: '狗中暑', nick: '大黄的铲屎官', points: 3050, body: '夏天遛狗中暑，别用冰水！用常温水擦四肢和肚子降温，边降边送医，冰水会让血管收缩更危险。', helpful: 201, earned: 1120 },
  { tag: '幼猫低血糖', nick: '奶糖麻麻', points: 560, body: '两月龄小猫突然瘫软，抹了点蜂蜜在牙龈上缓过来，路上就往医院冲。小奶猫饿不得。', helpful: 88, earned: 430 },
  { tag: '猫牙口炎', nick: '布丁爸爸', points: 940, body: '猫突然不吃硬粮、流口水，查出来是口炎。早发现能保守治疗，拖久了只能拔牙。', helpful: 63, earned: 320 },
]

// §6.3 贡献榜（分值高到低）
export const RANKING = [
  { nick: '豆芽的铲屎官', contributed: 42, recognized: 1830, points: 5240 },
  { nick: '大黄的铲屎官', contributed: 36, recognized: 1560, points: 4610 },
  { nick: '毛毛虫医生', contributed: 31, recognized: 1290, points: 3980 },
  { nick: '可乐爸', contributed: 28, recognized: 980, points: 3120 },
  { nick: '三三妈妈', contributed: 24, recognized: 870, points: 2740 },
  { nick: '布丁爸爸', contributed: 19, recognized: 640, points: 2050 },
  { nick: '奶糖麻麻', contributed: 15, recognized: 520, points: 1680 },
  { nick: '橘座本座', contributed: 12, recognized: 410, points: 1320 },
  { nick: '雪球的家长', contributed: 9, recognized: 300, points: 980 },
  { nick: '两只猫一条狗', contributed: 7, recognized: 240, points: 760 },
]

// §6.4 备货清单（1 分 = 0.1 元）
export const STORE = [
  { name: '宠物益生菌', price: 39, points: 390, use: '软便、换粮期、应激后，先在家试两天', emoji: '🦠', tint: '#EDF5F0' },
  { name: '电子体温计', price: 29, points: 290, use: '疑似发烧时，肛温比手感靠谱得多', emoji: '🌡️', tint: '#EAF0F7' },
  { name: '体内驱虫药', price: 65, points: 650, use: '定期驱虫，户外遛弯的猫狗更要备', emoji: '💊', tint: '#FBF3E5' },
  { name: '伊丽莎白圈', price: 25, points: 250, use: '术后或皮肤上药，防止舔咬伤口', emoji: '🔵', tint: '#F3EEF9' },
  { name: '营养膏', price: 45, points: 450, use: '食欲差、病后恢复期补充能量', emoji: '🧴', tint: '#FBEFEE' },
  { name: '便携航空箱', price: 129, points: 1290, use: '急诊、就医、出行，关键时刻装得下它', emoji: '🧳', tint: '#EEF1F4' },
]
