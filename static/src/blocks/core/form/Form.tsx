export interface FormProps {
    formContent?: string;
}

const formHtml: string = `<div class="gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework" data-form-theme="gravity-theme" data-form-index="0" id="gform_wrapper_2">
       <form method="post" enctype="multipart/form-data" id="gform_2" action="/" data-formid="2" novalidate="">
        <div class="gform-body gform_body"><div id="gform_fields_2" class="gform_fields top_label form_sublabel_below description_below validation_below"><div id="field_2_1" class="gfield gfield--type-text gfield--input-type-text gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"><label class="gfield_label gform-field-label" for="input_2_1">First Name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_1" id="input_2_1" type="text" value="" class="large" placeholder="Enter Name" aria-required="true" aria-invalid="false"><div data-lastpass-icon-root="" style="position: relative !important; height: 0px !important; width: 0px !important; display: initial !important; float: left !important;"></div></div></div><div id="field_2_3" class="gfield gfield--type-text gfield--input-type-text gfield--width-half field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"><label class="gfield_label gform-field-label" for="input_2_3">Last Name</label><div class="ginput_container ginput_container_text"><input name="input_3" id="input_2_3" type="text" value="" class="large" placeholder="Enter Name" aria-invalid="false"></div></div><div id="field_2_4" class="gfield gfield--type-email gfield--input-type-email gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"><label class="gfield_label gform-field-label" for="input_2_4">Email</label><div class="ginput_container ginput_container_email">
            <input name="input_4" id="input_2_4" type="email" value="" class="large" placeholder="your@email.com" aria-invalid="false">
        </div></div><div id="field_2_5" class="gfield gfield--type-select gfield--input-type-select gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"><label class="gfield_label gform-field-label" for="input_2_5">How can we help?</label><div class="ginput_container ginput_container_select"><select name="input_5" id="input_2_5" class="large gfield_select" aria-invalid="false"><option value="" selected="selected" class="gf_placeholder">Select a Topic</option><option value="First Choice">First Choice</option><option value="Second Choice">Second Choice</option><option value="Third Choice">Third Choice</option></select></div></div></div></div>
        <div class="gform-footer gform_footer top_label"> <input type="submit" id="gform_submit_button_2" class="gform_button button" value="Submit"></div></form></div>`;

/** Static rendering of core/heading. */
export const Form = ({
       formContent = formHtml,
    }: FormProps) => {

    return (
        <div
            dangerouslySetInnerHTML={{ __html: formContent ?? '' }}
        />
    );
};

export default Form;
