import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
export default function LoginResetPassword(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login-reset-password.ftl";
            }
        >,
        I18n
    >
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });
    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            displayMessage={!messagesPerField.existsError("username")}
            infoNode={
                realm.duplicateEmailsAllowed
                    ? msg("emailInstructionUsername")
                    : msg("emailInstruction")
            }
            headerNode={msg("emailForgotTitle")}
        >
            <form id="kc-reset-password-form" action={url.loginAction} method="post">
                <div>
                    <label htmlFor="username">
                        {!realm.loginWithEmailAllowed
                            ? msg("username")
                            : !realm.registrationEmailAsUsername
                              ? msg("usernameOrEmail")
                              : msg("email")}
                    </label>

                    <div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            autoFocus
                            defaultValue={auth.attemptedUsername ?? ""}
                            aria-invalid={messagesPerField.existsError("username")}
                        />
                        {messagesPerField.existsError("username") && (
                            <span
                                id="input-error-username"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: messagesPerField.get("username")
                                }}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <a href={url.loginUrl}>{msg("backToLogin")}</a>

                    <div id="kc-form-buttons">
                        <input type="submit" value={msgStr("doSubmit")} />
                    </div>
                </div>
            </form>
        </Template>
    );
}
