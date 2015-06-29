<?php

class MinusBaselineThemeHooks implements Gdn_IPlugin {

    public function setup() {}

    //remove mobile-unfriendly plugins
    public function gdn_dispatcher_afterAnalyzeRequest_handler($sender) {
        $inPublicDashboard = $sender->application() == 'dashboard'
            && in_array($sender->controller(), array('Activity', 'Profile', 'Search')); 
        if (in_array($sender->application(), array('vanilla', 'conversations')) || $inPublicDashboard) { 
            Gdn::pluginManager()->removeMobileUnfriendlyPlugins();
        }
        saveToConfig('Garden.Format.EmbedSize', '240x135', false);
        saveToConfig('Vanilla.AdminCheckboxes.Use', false, false);

        //the table discussions layout takes up too much space on small screens
        saveToConfig('Vanilla.Discussions.Layout', 'modern', false);
    }

    public function base_render_before($sender) {
        if ($sender->MasterView == 'admin') return;

        //tell the browser this is a mobile style
        $sender->Head->addTag('meta', array(
            'name' => 'viewport',
            'content' => "width=device-width,minimum-scale=1.0,maximum-scale=1.0"
        ));

        //position of the panel
        $sender->CssClass .= c('MinusBaseline.Panel.Left', false) ? ' PanelLeft' : ' PanelRight';

        //add the hamburger menu
        $sender->addAsset('Content', anchor('n', url('#'), 'Hamburger'), 'Hamburger');

        //add the searchbox to the panel
        //copied from library/vendors/SmartyPlugins/function.searchbox.php
        $form = Gdn::factory('Form');
        $form->InputPrefix = '';
        $search = $form->Open(array('action' => Url('/search'), 'method' => 'get'))
            .$form->TextBox('Search', array('placeholder' => T('SearchBoxPlaceHolder', 'Search')))
            .$form->Button('Go', array('Name' => ''))
            .$form->Close();
        $search = wrap($search, 'div', array('class' => 'SiteSearch'));
        $sender->addAsset('Panel', $search, 'SearchBox');

        //nomobile link to switch to the full site
        $noMobile = Gdn_Theme::link(
            'profile/nomobile',
            t('Full Site'),
            wrap('<a href="%url" class="%class">%text</a>', 'div', array('class' => 'NoMobile'))
        );
        $sender->addAsset('Foot', $noMobile, 'NoMobile');
    }

    //put the userphoto in the content area of profiles
    public function profileController_beforeUserInfo_handler($sender) {
        echo Gdn_Theme::module('UserPhotoModule');
    }

}
