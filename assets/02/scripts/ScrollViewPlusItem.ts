const { ccclass, property } = cc._decorator;

/**
 * @classdesc 配合「ScrollViewPlus」组件使用的ScrollViewItem组件
 * @author caizhitao
 * @version 0.1.0
 * @since 2019-07-12
 * @description
 *
 * 用法：
 *
 *      1. 将本组件挂载在Item节点上
 * 		2. 在属性面板上指定事件数组回调，即可监听 Item 「进入」和「离开」ScrollView可视区域的事件
 *
 */
@ccclass
export default class ScrollViewPlusItem extends cc.Component {
	@property({
		type: [cc.Component.EventHandler],
		tooltip: "进入ScrollView时的回调事件"
	})
	onEnterScorllViewEvents: cc.Component.EventHandler[] = [];

	@property({
		type: [cc.Component.EventHandler],
		tooltip: "离开ScrollView时的回调事件"
	})
	onExitScorllViewEvents: cc.Component.EventHandler[] = [];

	/**
	 * 当前是否在展示中
	 *
	 * 1. 在进入和离开ScrollView期间，为true
	 * 2. 在离开ScrolLView期间，为false
	 */
	private _isShowing: boolean = false;

	set isShowing(flag: boolean) {
		this._isShowing = flag;
		if (this._isShowing) {
			this._callBackOnEnterScrollViewEvent();
		} else {
			this._callBackOnExitScrollViewEvent();
		}
	}

	get isShowing() {
		return this._isShowing;
	}

	/**
	 * Item 进入 ScrollView 的时候回调
	 */
	private _callBackOnEnterScrollViewEvent() {
		if (this.onEnterScorllViewEvents.length == 0) {
			return;
		}
		this.onEnterScorllViewEvents.forEach(event => {
			event.emit([]);
		});
	}

	/**
	 * Item 离开 ScrollView 的时候回调
	 */
	private _callBackOnExitScrollViewEvent() {
		if (this.onExitScorllViewEvents.length == 0) {
			return;
		}
		this.onExitScorllViewEvents.forEach(event => {
			event.emit([]);
		});
	}
}
