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
		// 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
		let svLeftBottomPoint: cc.Vec2 = scrollView.node.parent.convertToWorldSpaceAR(
			cc.v2(
				scrollView.node.x - scrollView.node.anchorX * scrollView.node.width,
				scrollView.node.y - scrollView.node.anchorY * scrollView.node.height
			)
		);

		// 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
		let svBBoxRect: cc.Rect = cc.rect(
			svLeftBottomPoint.x,
			svLeftBottomPoint.y,
			scrollView.node.width,
			scrollView.node.height
		);

		// 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
		scrollView.content.children.forEach((childNode: cc.Node) => {
			// 没有绑定指定组件的子节点不处理
			let itemComponent = childNode.getComponent(ScrollViewPlusItem);
			if (itemComponent == null) {
				return;
			}

			// 如果相交了，那么就显示，否则就隐藏
			if (childNode.getBoundingBoxToWorld().intersects(svBBoxRect)) {
				if (!itemComponent.isShowing) {
					itemComponent.isShowing = true;
					itemComponent.onEnter();
				}
			} else {
				if (itemComponent.isShowing) {
					itemComponent.isShowing = false;
					itemComponent.onExit();
				}
			}
		});
	}
}
