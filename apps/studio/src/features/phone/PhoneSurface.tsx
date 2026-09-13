import { Banner, Button, ChannelTile, StateBoundary } from "@subiza/ui";
import {
  SUBIZA_FORWARD_NUMBER,
  bundleOf,
  documentsOf,
  maybeDetectSilentFailure,
} from "@subiza/auth-tenant";
import { emptyPhoneChannel, normalizePhoneChannel, phoneTileStatus } from "@subiza/domain";
import type { ViewState } from "@subiza/core";
import { getTranslations } from "next-intl/server";
import { requireStudioContext } from "@/lib/session";
import { hrefForPhone } from "./steps";

export async function PhoneSurface() {
  const ctx = await requireStudioContext();
  maybeDetectSilentFailure(ctx);
  const docs = documentsOf(ctx);
  const bundle = bundleOf(ctx);
  const phone = normalizePhoneChannel(bundle.phone ?? emptyPhoneChannel(SUBIZA_FORWARD_NUMBER), SUBIZA_FORWARD_NUMBER);
  const t = await getTranslations("console");
  const status = phoneTileStatus(phone);
  const state: ViewState<typeof phone> = { status: "ready", data: phone };
  const href =
    status === "err"
      ? hrefForPhone("lost")
      : phone.verification.verifiedAt
        ? hrefForPhone("done")
        : hrefForPhone("path");
  return (
    <StateBoundary
      state={state}
      copy={{
        emptyTitle: t("emptyTitle"),
        emptyBody: t("emptyBody"),
        emptyAction: (
          <Button tone="primary" asChild>
            <a href={hrefForPhone("path")}>{t("emptyAction")}</a>
          </Button>
        ),
        offline: t("offline"),
        deniedTitle: t("deniedTitle"),
        deniedBody: (who) => t("deniedBody", { who: who.join(", ") }),
        notFoundTitle: t("notFoundTitle"),
        rateLimited: (minutes) => t("rateLimited", { minutes }),
        errorTitle: t("errorTitle"),
        errorBody: t("errorBody"),
        support: t("support"),
      }}
      renderReady={() => (
        <section className="phone-hub">
          <h2>{t("phone")}</h2>
          <ChannelTile
            kind="ph"
            name={t("phone")}
            detail={
              status === "working"
                ? phone.subizaNumber
                : status === "err"
                  ? t("phoneErr")
                  : t("readonly")
            }
            status={status}
            statusLabel={
              status === "working"
                ? t("phoneWorking")
                : status === "err"
                  ? t("phoneErr")
                  : status === "action"
                    ? t("phoneAction")
                    : t("phoneOff")
            }
            action={
              <Button tone="secondary" size="sm" asChild>
                <a href={href}>{status === "err" ? t("phoneRepair") : t("phoneStart")}</a>
              </Button>
            }
          />
          {docs.phone?.skippedAt && !docs.phone.verification.verifiedAt ? (
            <Banner tone="info" title={t("phoneAction")}>
              {t("readonly")}
            </Banner>
          ) : null}
        </section>
      )}
    />
  );
}
