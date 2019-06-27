const { ccclass, property } = cc._decorator;

@ccclass
export default class SmallItemPrefab extends cc.Component {
	@property(cc.Label)
	itemLabel: cc.Label = null;

	bindData(itemIndex: number) {
		this.itemLabel.string = itemIndex + "";
	}
}
