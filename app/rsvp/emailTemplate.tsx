export function confirmationEmailHtml({
    name,
    prize,
    companionName,
}: {
    name: string
    prize?: string
    companionName?: string
}) {
    const googleCalendarUrl = new URL(
        'https://calendar.google.com/calendar/render'
    )
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE')
    googleCalendarUrl.searchParams.set('text', 'The Halloweeners')
    googleCalendarUrl.searchParams.set(
        'dates',
        '20261031T180000/20261101T020000'
    )
    googleCalendarUrl.searchParams.set(
        'location',
        'Kungsportsavenyen 1, 411 36 Gothenburg'
    )
    googleCalendarUrl.searchParams.set(
        'details',
        'The spirits await your arrival.'
    )

    const previousWinnerBlock = prize
        ? `
        <tr>
            <td style="padding: 24px; border: 1px solid #4a0000; background-color: #1a0000; border-radius: 4px; margin-top: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #ff6666;">
                    A reminder from the shadows
                </p>
                <p style="margin: 0; color: #cccccc; font-size: 16px;">
                    The spirits have not forgotten that you bear a title — reigning master of ${prize}. Your crown is yours no longer to keep, but to pass on. Do not arrive empty-handed. Bring forth the prize you once claimed, that it may be transferred with honor during the night's ceremony. The cycle demands it.
                </p>
            </td>
        </tr>
        <tr><td style="height: 24px;"></td></tr>
        `
        : ''

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Halloweeners</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Georgia, serif; color: #cccccc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 32px;">
                            <p style="margin: 0; font-size: 48px; color: #ffffff; font-family: Georgia, serif;">
                                The Halloweeners
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 14px; letter-spacing: 3px; color: #888888; text-transform: uppercase;">
                                October 31, 2026
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="border-top: 1px solid #333333; padding-bottom: 32px;"></td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td style="padding-bottom: 24px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.7;">
                                ${name},
                            </p>
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.7;">
                                Your answer has been received. The spirits have recorded your ${companionName ? `and your companion's name, ${companionName}` : 'name'}, and your place among the gathering is secured. We shall expect your presence as the veil thins on the night of October 31st.
                            </p>
                            <p style="margin: 0; font-size: 16px; line-height: 1.7;">
                                The hour and location are etched below. Do not lose them.
                            </p>
                        </td>
                    </tr>

                    <!-- Event details -->
                    <tr>
                        <td style="background-color: #111111; border: 1px solid #333333; border-radius: 4px; padding: 20px;">
                            <p style="margin: 0 0 6px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #888888;">When</p>
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #ffffff;">October 31, 2026 — 18:00</p>
                            <p style="margin: 0 0 6px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #888888;">Where</p>
                            <p style="margin: 0; font-size: 16px; color: #ffffff;">Kungsportsavenyen 1, 411 36 Gothenburg</p>
                        </td>
                    </tr>

                    <tr><td style="height: 24px;"></td></tr>

                    <!-- Add to calendar -->
                    <tr>
                        <td style="padding-bottom: 24px;">
                            <p style="margin: 0 0 12px 0; font-size: 14px; color: #888888; letter-spacing: 1px; text-transform: uppercase;">Add to calendar</p>
                            <a href="${googleCalendarUrl.toString()}" style="display: inline-block; margin-right: 12px; color: #cccccc; font-size: 15px;">
                                Google
                            </a>
                            <span style="color: #444444;">|</span>
                            <a href="https://www.halloweeners.se/api/calendar" style="display: inline-block; margin-left: 12px; color: #cccccc; font-size: 15px;">
                                Apple / Outlook
                            </a>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="border-top: 1px solid #333333; padding-bottom: 24px;"></td>
                    </tr>

                    <!-- Previous winner block -->
                    ${previousWinnerBlock}

                    <!-- Change of plans -->
                    <tr>
                        <td style="padding-bottom: 32px;">
                            <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.7;">
                                Should your fate shift before October 28th, return to the site to update your answer — whether you wish to bring a companion or amend your details. If the darkness conspires to keep you away entirely, the spirits ask that you reach out to Mimmi or Sebastian directly. You know how to find us.
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="border-top: 1px solid #333333; padding-bottom: 24px;"></td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center;">
                            <p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.7;">
                                The spirits do not accept replies to this message.<br>
                                If you must speak, you know where to find us.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
}
