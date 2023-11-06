const videoCls = [
	{ type: 0, label: '全部' },
	{ type: 1, label: '推荐' },
	{ type: 2, label: '热门' },
	{ type: 3, label: '风景' },
	{ type: 4, label: '宠物' },
	{ type: 5, label: '体育' },
	{ type: 6, label: '美食' },
	{ type: 7, label: '娱乐' },
	{ type: 8, label: '时尚' },
]

const tags = ["全部","推荐","热门","风景","宠物","体育","美食","娱乐","时尚"]

const videoOrder =[
	{ type: 'publish_time', label: '时间',icon:"Timer"},
	{ type: 'favorite_count', label: '喜爱度',icon:"Position"},
	{ type: 'total_collected', label: '收藏量',icon:"Star"},
	{ type: 'comment_count', label: '评论数',icon:"ChatDotRound"},
]

const userOrder =[
	{ type: 'name', label: '名称',icon:"Timer"},
	{ type: 'total_favorited', label: '喜爱度',icon:"Position"},
	{ type: 'total_collected', label: '收藏量',icon:"Star"},
]
export default {videoCls, tags,videoOrder,userOrder};