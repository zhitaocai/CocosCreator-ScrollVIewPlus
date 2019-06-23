import ItemPrefabCtrl from "./ItemPrefabCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DirectLoadScrollViewCtrl extends cc.Component {
	@property(cc.ScrollView)
	scrollView: cc.ScrollView = null;

	@property(cc.Prefab)
	itemPrefab: cc.Prefab = null;

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 示例一：直接创建指定数量的子节点

	private _initItem(itemIndex: number) {
		let itemNode = cc.instantiate(this.itemPrefab);
		itemNode.width = this.scrollView.content.width / 10;
		itemNode.height = itemNode.width;
		itemNode.parent = this.scrollView.content;
		itemNode.setPosition(0, 0);
		itemNode.getComponent(ItemPrefabCtrl).bindData(itemIndex);
	}

	async directLoad(childNodeCount: number) {
		await new Promise((resolve, reject) => {
			this.scrollView.content.removeAllChildren();
			for (let i = 0; i < childNodeCount; i++) {
				this._initItem(i);
			}
			resolve();
		});
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 示例二：分帧创建指定数量的子节点

	async framingLoad(childNodeCount: number) {
		this.scrollView.content.removeAllChildren();
		await this.executePreFrame(this._getItemGenerator(childNodeCount), 1);
	}

	/**
	 * 分帧执行 Generator 逻辑
	 *
	 * @param generator 生成器
	 * @param duration 持续时间（ms），每次执行 Generator 的操作时，最长可持续执行时长。假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
	 */
	private executePreFrame(generator: Generator, duration: number) {
		return new Promise((resolve, reject) => {
			let gen = generator;
			let execute = () => {
				let startTime = new Date().getTime();
				for (let iter = gen.next(); ; iter = gen.next()) {
					if (iter == null || iter.done) {
						resolve();
						return;
					}
					if (new Date().getTime() - startTime > duration) {
						this.scheduleOnce(() => {
							execute();
						});
						return;
					}
				}
			};
			execute();
		});
	}

	private *_getItemGenerator(childNodeCount: number) {
		for (let i = 0; i < childNodeCount; i++) {
			yield this._initItem(i);
		}
	}
}
