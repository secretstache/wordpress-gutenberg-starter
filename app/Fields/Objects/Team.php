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

            ->addText('team_job_title', [
				'label'     => 'Job Title',
			])

			->setLocation('post_type', '==', 'ssm_team');

		// Register Team Member Info
		add_action('acf/init', function() use ($teamMemberInfo) {
			acf_add_local_field_group($teamMemberInfo->build());
		});

    }

}