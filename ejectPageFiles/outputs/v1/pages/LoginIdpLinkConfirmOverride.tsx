import { getKcClsx } from "rionizkeycloakify/login/lib/kcClsx";
import type { PageProps } from "rionizkeycloakify/login/pages/PageProps";
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
    ListItem,
    Checkbox,
    Radio
} from "@mui/material";
import { styles } from "../styles/pages/LoginIdpLinkConfirmOverride.ts";
export default function LoginIdpLinkConfirmOverride(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login-idp-link-confirm-override.ftl";
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
    const { url, idpDisplayName } = kcContext;
    const { msg } = i18n;
    return (
        <Template
            id="LoginIdpLinkConfirmOverride_Template_1"
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("confirmOverrideIdpTitle")}
        >
            <Box
                action={url.loginAction}
                method="post"
                component="form"
                id="LoginIdpLinkConfirmOverride_Box_1"
                sx={styles.LoginIdpLinkConfirmOverride_Box_1}
            >
                {msg("pageExpiredMsg1")}{" "}
                <Link
                    href={url.loginRestartFlowUrl}
                    id="LoginIdpLinkConfirmOverride_Link_1"
                    sx={styles.LoginIdpLinkConfirmOverride_Link_1}
                >
                    {msg("doClickHere")}
                </Link>
                <br id="LoginIdpLinkConfirmOverride_br_1" />
                <br id="LoginIdpLinkConfirmOverride_br_2" />
                <Button
                    type="submit"
                    name="submitAction"
                    value="confirmOverride"
                    id="LoginIdpLinkConfirmOverride_Button_1"
                    sx={styles.LoginIdpLinkConfirmOverride_Button_1}
                >
                    {msg("confirmOverrideIdpContinue", idpDisplayName)}
                </Button>
            </Box>
        </Template>
    );
}
