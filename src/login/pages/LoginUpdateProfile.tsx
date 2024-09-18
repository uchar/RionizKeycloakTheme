import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
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
import { styles } from "./styles/LoginUpdateProfile.ts";
type LoginUpdateProfileProps = PageProps<
    Extract<
        KcContext,
        {
            pageId: "login-update-profile.ftl";
        }
    >,
    I18n
> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};
export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        classes,
        UserProfileFormFields,
        doMakeUserConfirmPassword
    } = props;
    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });
    const { messagesPerField, url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayRequiredFields
            headerNode={msg("loginProfileTitle")}
            displayMessage={messagesPerField.exists("global")}
        >
            <Box
                action={url.loginAction}
                method="post"
                component="form"
                id="Box_1"
                sx={styles.Box_1}
            >
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                <Box id="Box_2" sx={styles.Box_2}>
                    <TextField
                        disabled={!isFormSubmittable}
                        type="submit"
                        value={msgStr("doSubmit")}
                        id="TextField_1"
                        sx={styles.TextField_1}
                    />
                    {isAppInitiatedAction && (
                        <Button
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            formNoValidate
                            id="Button_1"
                            sx={styles.Button_1}
                        >
                            {msg("doCancel")}
                        </Button>
                    )}
                </Box>
            </Box>
        </Template>
    );
}
