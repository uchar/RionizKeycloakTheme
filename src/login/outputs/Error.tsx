import { Box, Button, Link, TextField, FormLabel } from "@mui/material";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
export default function Error(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "error.ftl";
            }
        >,
        I18n
    >
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <Box id="kc-error-message">
                <p dangerouslySetInnerHTML={{ __html: message.summary }} />
                {!skipLink && client !== undefined && client.baseUrl !== undefined && (
                    <p>
                        <Link id="backToApplication" href={client.baseUrl}>
                            {msg("backToApplication")}
                        </Link>
                    </p>
                )}
            </Box>
        </Template>
    );
}
