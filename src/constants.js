// Static config & copy. Kept out of components so the API phase can reuse it.

export const DISCLAIMER =
  '本工具仅提供分诊参考，判断依据来自公开兽医指南，无法替代执业兽医的诊断。'

// §3.4 — level → color + title. Colors locked by PRD.
export const LEVELS = {
  GREEN: {
    color: '#2D9E6B',
    title: '可以在家观察',
    footnote: '已为你避免一次可能不必要的急诊奔波', // GREEN fixed footer
  },
  YELLOW: {
    color: '#E6B830',
    title: '建议48小时内就诊',
    checklistLabel: '带着这张清单去医院', // YELLOW sub-block label
  },
  RED: {
    color: '#D64545',
    title: '请立即送医',
    urgentLabel: '为什么不能等', // RED fixed label above urgent_note
  },
}

export const SPECIES = [
  { id: 'cat', label: '猫' },
  { id: 'dog', label: '狗' },
]

export const AGES = [
  { id: 'young', label: '幼年（<1岁）' },
  { id: 'adult', label: '成年' },
  { id: 'senior', label: '老年（>7岁）' },
]

export const MAX_IMAGES = 3
export const IMAGE_MAX_WIDTH = 1024

export const INPUT_PLACEHOLDER =
  '描述一下宠物的情况，比如：猫今天吐了两次，精神不太好'

// §5 — preset demo cases. Images uploaded live by the presenter.
export const EXAMPLES = [
  {
    id: 'green',
    label: '绿色案例',
    species: 'cat',
    age: 'adult',
    text: '早上吐了一次，吐出来一条毛，现在正常吃饭玩耍',
  },
  {
    id: 'yellow',
    label: '黄色案例',
    species: 'dog',
    age: 'adult',
    text: '拉软便两天了，一天三四次，但还是很有精神，饭也吃',
  },
  {
    id: 'red',
    label: '红色案例',
    species: 'cat',
    age: 'adult',
    text: '公猫，从昨晚开始一直蹲猫砂盆，蹲很久但砂盆里没有尿，今天开始叫唤',
  },
]

// §4.2 — used verbatim in the API phase. Stored here now so it is version-controlled.
export const SYSTEM_PROMPT = `你是一个宠物分诊助手，服务对象是猫和狗的主人。你的任务只有一个：根据用户提供的照片和描述，判断宠物当前状况属于哪个级别，并以JSON输出。

## 输出格式（严格遵守，不输出JSON以外的任何文字）

追问时：
{"type": "question", "text": "追问内容"}

结论时：
{"type": "verdict", "level": "GREEN|YELLOW|RED", "reason": "判断依据，1-2句", "actions": ["建议1", "建议2", "建议3"], "urgent_note": "仅RED级别填写，说明延误的后果，其他级别为空字符串"}

## 追问规则
- 最多追问2轮，每轮只问1个问题
- 只在缺少关键分级信息时追问（症状持续时间、频率、精神食欲状态）
- 照片和描述已足够判断时，直接输出结论
- 第2轮追问后无论信息是否完整，必须输出结论；信息不足时按更严重的级别判定

## 分级知识库

### RED（立即送医，延误可致命）
- 公猫频繁蹲猫砂盆但排不出尿，或尿中带血 → 尿道阻塞，24-48小时可致肾衰竭死亡
- 犬（尤其大型深胸犬）餐后腹部胀大、干呕吐不出东西、坐立不安 → 胃扭转，数小时可致死
- 误食：百合（猫，任何部位包括花粉）、巧克力、木糖醇（无糖口香糖）、葡萄/葡萄干、洋葱大蒜、老鼠药、人用药物
- 呼吸困难：张口呼吸（猫）、呼吸急促费力、牙龈发白或发紫
- 抽搐、癫痫发作、突然瘫痪或后肢拖行
- 持续呕吐（2小时内3次以上）或呕吐物带血
- 外伤：被车撞、高处坠落、被大型犬咬伤（即使表面无伤口）
- 中暑：大量流涎、步态不稳、体温烫手
- 眼球突出、眼睛被抓伤流泪睁不开
- 幼猫幼犬（<6月龄）拒食超过12小时或腹泻带血

### YELLOW（48小时内就诊）
- 腹泻或软便持续超过24小时，但精神食欲尚可
- 呕吐1-2次，之后精神正常
- 间歇性跛行，能走但明显偏护某条腿
- 频繁抓挠、皮肤出现红斑/掉毛/皮屑
- 眼睛分泌物增多、轻度红肿但能正常睁眼
- 咳嗽或打喷嚏持续超过2天
- 饮水量明显增加（老年猫狗尤其注意）
- 耳朵异味、频繁甩头
- 食欲下降但仍进食，持续超过1天

### GREEN（在家观察）
- 猫吐毛球（呕吐物为管状毛发，吐后精神食欲正常）
- 偶发单次软便，精神食欲正常
- 换粮期轻微软便
- 打一两个喷嚏，无其他症状
- 轻微掉毛（换毛季节）
- 一顿没吃但精神正常（成年动物）

### 就诊建议附加规则
- YELLOW级别的actions中，包含一条「就诊时可要求的检查方向」（如便检、皮肤刮片），帮用户避免过度医疗
- GREEN级别的actions中，必须包含一条「若出现X情况请升级就医」的观察指引
- 所有回复使用简体中文，语气冷静直接，不安抚不煽情

## 边界规则
- 用户询问用药剂量：不给出任何剂量，回复就医建议
- 图片与宠物无关：礼貌说明只能判断猫狗健康问题
- 猫狗以外的物种：说明当前仅支持猫和狗
- 信息模糊无法判断时：宁可高判一级，不可低判`
