import { useState, useEffect, useReducer } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { assert } from "keycloakify/tools/assert";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import {
    Box,
    Button,
    Link,
    TextField,
    FormLabel,
    Typography,
    List,
    ListItem
} from "@mui/material";
import { styles } from "./styles/LoginPassword.ts";
export default function LoginPassword(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login-password.ftl";
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
    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
            displayMessage={!messagesPerField.existsError("password")}
        >
            <Box id="Box_1" sx={styles.Box_1}>
                <Box
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                    component="form"
                    id="Box_2"
                    sx={styles.Box_2}
                >
                    <Box id="Box_3" sx={styles.Box_3}>
                        <hr />
                        <FormLabel
                            htmlFor="password"
                            id="FormLabel_1"
                            sx={styles.FormLabel_1}
                        >
                            {msg("password")}
                        </FormLabel>

                        <PasswordWrapper
                            kcClsx={kcClsx}
                            i18n={i18n}
                            passwordInputId="password"
                        >
                            <TextField
                                tabIndex={2}
                                name="password"
                                type="password"
                                autoFocus
                                autoComplete="on"
                                aria-invalid={messagesPerField.existsError(
                                    "username",
                                    "password"
                                )}
                                id="TextField_1"
                                sx={styles.TextField_1}
                            />
                        </PasswordWrapper>

                        {messagesPerField.existsError("password") && (
                            <span
                                id="input-error-password"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: messagesPerField.get("password")
                                }}
                            />
                        )}
                    </Box>
                    <Box id="Box_4" sx={styles.Box_4}>
                        {realm.resetPasswordAllowed && (
                            <span>
                                <Link
                                    tabIndex={5}
                                    href={url.loginResetCredentialsUrl}
                                    id="Link_1"
                                    sx={styles.Link_1}
                                >
                                    {msg("doForgotPassword")}
                                </Link>
                            </span>
                        )}
                    </Box>
                    <Box id="Box_5" sx={styles.Box_5}>
                        <TextField
                            tabIndex={4}
                            name="login"
                            type="submit"
                            value={msgStr("doLogIn")}
                            disabled={isLoginButtonDisabled}
                            id="TextField_2"
                            sx={styles.TextField_2}
                        />
                    </Box>
                </Box>
            </Box>
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
        <Box id="Box_6" sx={styles.Box_6}>
            {children}
            <Button
                type="button"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
                id="Button_1"
                sx={styles.Button_1}
            >
                <i aria-hidden />
            </Button>
        </Box>
    );
}
