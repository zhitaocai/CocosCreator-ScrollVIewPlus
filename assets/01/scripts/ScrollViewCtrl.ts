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

	async directLoad(length: number) {
		await new Promise((resolve, reject) => {
			this.scrollView.content.removeAllChildren();
			for (let i = 0; i < length; i++) {
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
			// 创建执行函数
			let execute = () => {
				// 执行之前，先记录开始时间
				let startTime = new Date().getTime();

				// 然后一直从 Generator 中获取已经拆分好的代码段出来执行
				for (let iter = gen.next(); ; iter = gen.next()) {
					// 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
					if (iter == null || iter.done) {
						resolve();
						return;
					}

					// 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
					if (new Date().getTime() - startTime > duration) {
						// 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
						this.scheduleOnce(() => {
							execute();
						});
						return;
					}
				}
			};

			// 运行执行函数
			execute();
		});
	}

	private *_getItemGenerator(length: number) {
		for (let i = 0; i < length; i++) {
			yield this._initItem(i);
		}
	}
}
