<?php if (!defined('APPLICATION')) exit();

class MinusBaseLineThemeHooks implements Gdn_IPlugin {

	public function Setup() { }

	//remove mobile-unfriendly plugins
	public function Gdn_Dispatcher_AfterAnalyzeRequest_Handler($Sender) {
		if (in_array($Sender->Application(), array('vanilla', 'conversations')) || ($Sender->Application() == 'dashboard' && in_array($Sender->Controller(), array('Activity', 'Profile', 'Search')))) {
			Gdn::PluginManager()->RemoveMobileUnfriendlyPlugins();
		}
		SaveToConfig('Garden.Format.EmbedSize', '240x135', false);
	}

	public function Base_Render_Before($Sender) {
		//tell the browser this is a mobile style
		$Sender->Head->AddTag('meta', array('name' => 'viewport', 'content' => "width=device-width,minimum-scale=1.0,maximum-scale=1.0"));
		
		//add the hamburger menu
		$Sender->AddAsset('Content', Anchor('n', Url('#'), 'Hamburger'), 'Hamburger');

		$Sender->AddJsFile('minusbaseline.js');

		//add the searchbox to the panel
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
		
		//nomobile link to switch to the full site
		$NoMobile = Gdn_Theme::Link(
			'profile/nomobile',
			T("Full Site"),
			Wrap('<a href="%url" class="%class">%text</a>', 'div', array('class' => 'NoMobile'))
		);
		$Sender->AddAsset('Foot', $NoMobile, 'NoMobile');
	}

	//disable admincheckboxes
	public function CategoriesController_Render_Before($Sender) {
		SaveToConfig('Vanilla.AdminCheckboxes.Use', false, false);
	}

	public function DiscussionsController_Render_Before($Sender) {
		SaveToConfig('Vanilla.AdminCheckboxes.Use', false, false);
	}

	//put the userphoto in the content area of profiles
	public function ProfileController_BeforeUserInfo_Handler($Sender) {
		$UserPhoto = new UserPhotoModule();
		echo $UserPhoto->ToString();
	}

}
