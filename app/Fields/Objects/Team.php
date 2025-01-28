<?php

namespace App\Fields\Objects;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Team {

	public function __construct() {

        /**
		 * Team Member Info
		 */
		$teamMemberInfo = new FieldsBuilder('team_member_info', [
			'title'     => 'Team Member Info',
			'position'  => 'acf_after_title',
		]);

		$teamMemberInfo

			->addImage('team_headshot', [
				'label'			=> 'Headshot',
				'preview_size'	=> 'medium',
			])

			->addText('team_first_name', [
				'label'     => 'First Name',
				'wrapper'	=> [
					'width'	=> 50
				]
			])

			->addText('team_last_name', [
				'label'     => 'Last Name',
				'wrapper'	=> [
					'width'	=> 50
				]
			])

            ->addText('team_job_title', [
				'label'     => 'Job Title',
			])

			->addWysiwyg('team_bio', [
				'label'         => 'Bio',
				'toolbar'       => 'basic',
				'media_upload' 	=> 0
			])

			->setLocation('post_type', '==', 'ssm_team');

		// Register Team Member Info
		add_action('acf/init', function() use ($teamMemberInfo) {
			acf_add_local_field_group($teamMemberInfo->build());
		});

    }

}