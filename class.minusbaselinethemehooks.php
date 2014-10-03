<?php if (!defined('APPLICATION')) exit();

class MinusBaseLineThemeHooks implements Gdn_IPlugin {

	public function Setup() { }

	public function Gdn_Dispatcher_AfterAnalyzeRequest_Handler($Sender) {
		if (in_array($Sender->Application(), array('vanilla', 'conversations')) || ($Sender->Application() == 'dashboard' && in_array($Sender->Controller(), array('Activity', 'Profile', 'Search')))) {
		 Gdn::PluginManager()->RemoveMobileUnfriendlyPlugins();
		}
		SaveToConfig('Garden.Format.EmbedSize', '240x135', false);
	}

	public function Base_Render_Before($Sender) {
		$Sender->AddAsset('Content', Anchor('n', Url('#'), 'Hamburger'), 'Hamburger');

		$Sender->AddJsFile('minusbaseline.js');

		//copied from library/vendors/SmartyPlugins/function.searchbox.php
		$Form = Gdn::Factory('Form');
		$Form->InputPrefix = '';
		$Result =
		$Form->Open(array('action' => Url('/search'), 'method' => 'get')).
		$Form->TextBox('Search', array('placeholder' => T('SearchBoxPlaceHolder', 'Search'))).
		$Form->Button('Go', array('Name' => '')).
		$Form->Close();
		$Result = Wrap($Result, 'div', array('class' => 'SiteSearch'));

		$Sender->AddAsset('Panel', $Result, 'SearchBox');
	}

	public function CategoriesController_Render_Before($Sender) {
		$Sender->ShowOptions = false;
		SaveToConfig('Vanilla.AdminCheckboxes.Use', false, false);
	}

	public function DiscussionsController_Render_Before($Sender) {
		$Sender->ShowOptions = false;
		SaveToConfig('Vanilla.AdminCheckboxes.Use', false, false);
	}

	public function ProfileController_BeforeUserInfo_Handler($Sender) {
		$UserPhoto = new UserPhotoModule();
		echo $UserPhoto->ToString();
	}
}