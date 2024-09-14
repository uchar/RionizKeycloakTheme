import { useEffect } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useStylesAndScripts } from "keycloakify/login/Template.useStylesAndScripts";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const {
        msg,
        msgStr,
        getChangeLocaleUrl,
        labelBySupportedLanguageTag,
        currentLanguageTag
    } = i18n;
    const { realm, locale, auth, url, message, isAppInitiatedAction } = kcContext;
    useEffect(() => {
        document.title =
            documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);
    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });
    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });
    const { isReadyToRender } = useStylesAndScripts({ kcContext, doUseDefaultCss });
    if (!isReadyToRender) {
        return null;
    }
    return (
        <div>
            {msg("loginTitleHtml", realm.displayNameHtml)}

            <header>
                {realm.internationalizationEnabled &&
                    (assert(locale !== undefined), locale.supported.length > 1) && (
                        <div id="kc-locale">
                            <button
                                tabIndex={1}
                                id="kc-current-locale-link"
                                aria-label={msgStr("languages")}
                                aria-haspopup="true"
                                aria-expanded="false"
                                aria-controls="language-switch1"
                            >
                                {labelBySupportedLanguageTag[currentLanguageTag]}
                            </button>
                            <ul
                                role="menu"
                                tabIndex={-1}
                                aria-labelledby="kc-current-locale-link"
                                aria-activedescendant=""
                                id="language-switch1"
                            >
                                {locale.supported.map(({ languageTag }, i) => (
                                    <li key={languageTag} role="none">
                                        <a
                                            role="menuitem"
                                            id={`language-${i + 1}`}
                                            href={getChangeLocaleUrl(languageTag)}
                                        >
                                            {labelBySupportedLanguageTag[languageTag]}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                {(() => {
                    const node = !(
                        auth !== undefined &&
                        auth.showUsername &&
                        !auth.showResetCredentials
                    ) ? (
                        <h1 id="kc-page-title">{headerNode}</h1>
                    ) : (
                        <div id="kc-username">
                            <label id="kc-attempted-username">
                                {auth.attemptedUsername}
                            </label>
                            <a
                                id="reset-login"
                                href={url.loginRestartFlowUrl}
                                aria-label={msgStr("restartLoginTooltip")}
                            >
                                <div>
                                    <i></i>
                                    <span>{msg("restartLoginTooltip")}</span>
                                </div>
                            </a>
                        </div>
                    );
                    if (displayRequiredFields) {
                        return (
                            <div>
                                *{msg("requiredFields")}
                                {node}
                            </div>
                        );
                    }
                    return node;
                })()}
            </header>
            <div id="kc-content">
                {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                {displayMessage &&
                    message !== undefined &&
                    (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div>
                            {message.type === "success" && <span></span>}
                            {message.type === "warning" && <span></span>}
                            {message.type === "error" && <span></span>}
                            {message.type === "info" && <span></span>}

                            <span
                                dangerouslySetInnerHTML={{
                                    __html: message.summary
                                }}
                            />
                        </div>
                    )}
                {children}
                {auth !== undefined && auth.showTryAnotherWayLink && (
                    <form
                        id="kc-select-try-another-way-form"
                        action={url.loginAction}
                        method="post"
                    >
                        <div>
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <a
                                href="#"
                                id="try-another-way"
                                onClick={() => {
                                    document.forms[
                                        "kc-select-try-another-way-form" as never
                                    ].submit();
                                    return false;
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </a>
                        </div>
                    </form>
                )}
                {socialProvidersNode}
                {displayInfo && <div id="kc-info">{infoNode}</div>}
            </div>
        </div>
    );
}
