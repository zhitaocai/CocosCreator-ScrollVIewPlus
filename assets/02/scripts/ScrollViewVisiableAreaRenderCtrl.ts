import LoadingDialogCtrl from "../../01/scripts/LoadingDialogCtrl";
import SeedPicItemPrefab, { SeedPicItemData as SeedPicItemModel } from "../prefabs/SeedPicItemPrefab";
import ScrollViewPlus from "./utils/ScrollViewPlus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewVisiableAreaRenderCtrl extends cc.Component {
	@property(cc.ScrollView)
	scrollView: cc.ScrollView = null;

	@property(cc.Prefab)
	seedItemPrefab: cc.Prefab = null;

	@property(LoadingDialogCtrl)
	loadingDialogCtrl: LoadingDialogCtrl = null;

	@property({
		type: cc.EditBox,
		tooltip: "输入需要创建的节点数量"
	})
	childNodeCountEditBox: cc.EditBox = null;

	async onFramingLoadBtnClick() {
		this.loadingDialogCtrl.show();
		this.scrollView.content.removeAllChildren();
		await this.executePreFrame(this._getItemGenerator(Number.parseInt(this.childNodeCountEditBox.string)), 1);
		this.scheduleOnce(() => {
			ScrollViewPlus.optDc(this.scrollView);
			this.loadingDialogCtrl.hide();
		});
	}

	onScrollViewEventCallBack(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: any) {
		if (eventType != cc.ScrollView.EventType.SCROLLING) {
			return;
		}
		if (scrollview.content.childrenCount == 0) {
			return;
		}
		ScrollViewPlus.optDc(scrollview);
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
			yield this._initSeedItemPrefab({
				index: i,
				picPath: `seed/${i % 12}` // 因为我这里就只有12张图片，所以就用 % 循环了
			});
		}
	}
	private _initSeedItemPrefab(data: SeedPicItemModel) {
		let itemNode = cc.instantiate(this.seedItemPrefab);
		itemNode.parent = this.scrollView.content;
		itemNode.getComponent(SeedPicItemPrefab).bindData(data);
	}
}
