import { useState, useEffect, useReducer } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
export default function Login(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login.ftl";
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
    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        registrationDisabled,
        messagesPerField
    } = kcContext;
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={
                realm.password && realm.registrationAllowed && !registrationDisabled
            }
            infoNode={
                <div id="kc-registration-container">
                    {msg("noAccount")}{" "}
                    <a tabIndex={8} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </a>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password &&
                        social?.providers !== undefined &&
                        social.providers.length !== 0 && (
                            <div id="kc-social-providers">
                                <hr />
                                <h2>{msg("identity-provider-login-label")}</h2>
                                <ul>
                                    {social.providers.map((...[p, , providers]) => (
                                        <li key={p.alias}>
                                            <a
                                                id={`social-${p.alias}`}
                                                type="button"
                                                href={p.loginUrl}
                                            >
                                                {p.iconClasses && (
                                                    <i aria-hidden="true"></i>
                                                )}
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: p.displayName
                                                    }}
                                                ></span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </>
            }
        >
            <div id="kc-form">
                {realm.password && (
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        {!usernameHidden && (
                            <div>
                                <label htmlFor="username">
                                    {!realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : !realm.registrationEmailAsUsername
                                          ? msg("usernameOrEmail")
                                          : msg("email")}
                                </label>
                                <input
                                    tabIndex={2}
                                    id="username"
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    type="text"
                                    autoFocus
                                    autoComplete="username"
                                    aria-invalid={messagesPerField.existsError(
                                        "username",
                                        "password"
                                    )}
                                />
                                {messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: messagesPerField.getFirstError(
                                                "username",
                                                "password"
                                            )
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="password">{msg("password")}</label>
                            <PasswordWrapper
                                kcClsx={kcClsx}
                                i18n={i18n}
                                passwordInputId="password"
                            >
                                <input
                                    tabIndex={3}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    aria-invalid={messagesPerField.existsError(
                                        "username",
                                        "password"
                                    )}
                                />
                            </PasswordWrapper>
                            {usernameHidden &&
                                messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: messagesPerField.getFirstError(
                                                "username",
                                                "password"
                                            )
                                        }}
                                    />
                                )}
                        </div>

                        <div>
                            {realm.rememberMe && !usernameHidden && (
                                <div>
                                    <label>
                                        <input
                                            tabIndex={5}
                                            id="rememberMe"
                                            name="rememberMe"
                                            type="checkbox"
                                            defaultChecked={!!login.rememberMe}
                                        />{" "}
                                        {msg("rememberMe")}
                                    </label>
                                </div>
                            )}

                            {realm.resetPasswordAllowed && (
                                <span>
                                    <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                        {msg("doForgotPassword")}
                                    </a>
                                </span>
                            )}
                        </div>

                        <div id="kc-form-buttons">
                            <input
                                type="hidden"
                                id="id-hidden-input"
                                name="credentialId"
                                value={auth.selectedCredential}
                            />
                            <input
                                tabIndex={7}
                                disabled={isLoginButtonDisabled}
                                name="login"
                                id="kc-login"
                                type="submit"
                                value={msgStr("doLogIn")}
                            />
                        </div>
                    </form>
                )}
            </div>
        </Template>
    );
}
function PasswordWrapper(props: {
    kcClsx: KcClsx;
    i18n: I18n;
    passwordInputId: string;
    children: JSX.Element;
}) {
    const { kcClsx, i18n, passwordInputId, children } = props;
    const { msgStr } = i18n;
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer(
        (isPasswordRevealed: boolean) => !isPasswordRevealed,
        false
    );
    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);
        assert(passwordInputElement instanceof HTMLInputElement);
        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);
    return (
        <div>
            {children}
            <button
                type="button"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                <i aria-hidden />
            </button>
        </div>
    );
}
