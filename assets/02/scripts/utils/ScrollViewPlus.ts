import ScrollViewPlusItem from "./ScrollViewPlusItem";

const { ccclass, property } = cc._decorator;

/**
 * @classdesc 只渲染可视区域的ScrollView
 * @author caizhitao
 * @version 0.1.0
 * @since 2019-05-30
 * @description
 *
 * 用法：
 *
 *      1. 将本组件挂载在节点上即可，和正常ScrollView使用一致
 *
 * 原理：
 *
 *      1. 滚动时，判断子节点是否进入了/离开了可视区域
 *      2. 根据结果回到出去，可以实现类似以下功能：
 *          * 控制可视区域Item显示（透明度改为 255 ），非可视区域Item隐藏（透明度改为 0 ）
 *      2. 非滚动时，尤其为第一次初始化时，也可以手动调用  ScrollViewPlus.optDc(scrollview: ScrollView) 方法去实现DC优化，原理和上述一致
 */
@ccclass
export default class ScrollViewPlus extends cc.ScrollView {
	onEnable() {
		this.node.on("scrolling", this._onScrolling, this);
	}

	onDisable() {
		this.node.off("scrolling", this._onScrolling, this);
	}

	private _onScrolling() {
		if (this.content.childrenCount == 0) {
			return;
		}
		this.optDc();
	}

	public optDc() {
		ScrollViewPlus.optDc(this);
	}

	/**
	 * 优化 ScrollView Content 节点 DC，可以手动调用
	 *
	 * 具体为
	 *
	 * 1. 进入ScrollView可视区域是，回调对应 Content 子节点上挂载的 ScollViewPlusItem 组件的 onEnter 方法（该方法实际会回调对应事件）
	 * 2. 退出ScrollView可视区域是，回调对应 Content 子节点上挂载的 ScollViewPlusItem 组件的 onExit 方法（该方法实际会回调对应事件）
	 */
	public static optDc(scrollView: cc.ScrollView) {
		// 计算 ScrollView 可视区域（可以理解为包围盒）在世界坐标系下的范围
		let bbCenterPoint = scrollView.node.parent.convertToWorldSpaceAR(
			cc.v2(
				scrollView.node.x - scrollView.node.anchorX * scrollView.node.width,
				scrollView.node.y - scrollView.node.anchorY * scrollView.node.height
			)
		);
		let bbRect = cc.rect(bbCenterPoint.x, bbCenterPoint.y, scrollView.node.width, scrollView.node.height);

		// 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
		scrollView.content.children.forEach((childNode: cc.Node) => {
			// 如果相交了，那么就显示，否则就隐藏
			if (childNode.getBoundingBoxToWorld().intersects(bbRect)) {
				let itemComponent = childNode.getComponent(ScrollViewPlusItem);
				if (itemComponent) {
					if (!itemComponent.isShowing) {
						itemComponent.isShowing = true;
						itemComponent.onEnter();
					}
				}
			} else {
				let itemComponent = childNode.getComponent(ScrollViewPlusItem);
				if (itemComponent) {
					if (itemComponent.isShowing) {
						itemComponent.isShowing = false;
						itemComponent.onExit();
					}
				}
			}
		});
	}

	public static EVENT_NAME_ENTER_SCROLLVIEW = "event_name_enter_scrollview";

	public static EVENT_NAME_EXIT_SCROLLVIEW = "event_name_exit_scrollview";
	/**
	 * 优化 ScrollView Content 节点 DC，可以手动调用
	 *
	 * 具体为在ScrollView可视区域内的节点，opacity 设置为 255，不在可视区域的节点，opacity 设置为 0
	 *
	 * 同时，
	 *
	 * 触发展示时，ScrollView Content 的子节点会给自身发送 enter_scrollview 事件
	 * 触发隐藏时，ScrollView Content 的子节点会给自身发送 exit_scrollview 事件
	 */
	public static optDcV1(scrollView: cc.ScrollView) {
		// 计算 ScrollView 可视区域（可以理解为包围盒）在世界坐标系下的范围
		let bbCenterPoint = scrollView.node.parent.convertToWorldSpaceAR(
			cc.v2(
				scrollView.node.x - scrollView.node.anchorX * scrollView.node.width,
				scrollView.node.y - scrollView.node.anchorY * scrollView.node.height
			)
		);
		let bbRect = cc.rect(bbCenterPoint.x, bbCenterPoint.y, scrollView.node.width, scrollView.node.height);

		// 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
		// 如果相交了，那么就显示，否则就隐藏
		scrollView.content.children.forEach((childNode: cc.Node) => {
			if (childNode.getBoundingBoxToWorld().intersects(bbRect)) {
				if (childNode.opacity != 255) {
					childNode.opacity = 255;
					childNode.emit(ScrollViewPlus.EVENT_NAME_ENTER_SCROLLVIEW);
				}
			} else {
				if (childNode.opacity != 0) {
					childNode.opacity = 0;
					childNode.emit(ScrollViewPlus.EVENT_NAME_EXIT_SCROLLVIEW);
				}
			}
		});
	}
}
