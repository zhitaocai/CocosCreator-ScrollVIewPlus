const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemPrefabCtrl extends cc.Component {
	@property(cc.Label)
	itemLabel: cc.Label = null;

	bindData(itemIndex: number) {
		this.itemLabel.string = itemIndex + "";
	}
}
