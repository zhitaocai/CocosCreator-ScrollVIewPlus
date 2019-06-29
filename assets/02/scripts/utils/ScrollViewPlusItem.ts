import ScrollViewPlus from "./ScrollViewPlus";

const { ccclass, property } = cc._decorator;

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
	isShowing: boolean = false;

	/**
	 * Item 进入 ScrollView 的时候回调
	 */
	onEnter() {
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
	onExit() {
		if (this.onExitScorllViewEvents.length == 0) {
			return;
		}
		this.onExitScorllViewEvents.forEach(event => {
			event.emit([]);
		});
	}
}
