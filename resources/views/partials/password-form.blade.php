<section class="content-block protected">

    <div class="grid-container">

        <div class="grid-x grid-margin-x align-center">

            <div class="cell small-12 medium-8">

                <form action="{!! site_url( 'wp-login.php?action=postpass', 'login_post' ) !!}" class="post-password-form" method="post">

                    <div class="component default">

                        <p class="text-center">This content is password protected. To view it please enter your password below:</p>

                        <p><input name="post_password" type="password" size="20" /></p>

                    </div>

                    <div class="module buttons align-center">
                        <input type="submit" class="button" name="Submit" value="Enter" />
                    </div>

                </form>  

            </div>

        </div>

    </div>

</section>  