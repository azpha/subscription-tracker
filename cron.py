import requests
import schedule
from datetime import date
import dateutil.parser

url = "http://localhost:3000"
discord_webhook_url = "https://discord.com/api/webhooks/1269149990878449724/8_F1GYDgW_9f7ZV3jgRzAzoLyPNuVAz1By4PJG4srRfelj4Y_oYQVR6Me8Kv4KwEhrxg"
discord_webhook_headers = {
    "content-type": "application/json"
}

def job():
    try:
        data = requests.get(f"{url}/api/trpc/subs.getUpcoming")
        json = data.json()
        subscriptions = json["result"]["data"]["json"]

        if len(subscriptions) > 0:
            fields = []
            expired_subscriptions = []

            for subscription in subscriptions:
                current_date = date.today()
                next_date = dateutil.parser.isoparse(subscription["nextBillingDate"]).date()
                difference = next_date - current_date

                if difference.days <= 0:
                    expired_subscriptions.append(subscription)

                fields.append(
                    {
                        "name": subscription["name"],
                        "value": f"{difference.days} day(s), {subscription["paymentMethod"]}",
                        "inline": True
                    }
                )

            send_discord_webhook_message({
                "username": "Subscriptions",
                "embeds": [
                    {
                        "title": "Subscriptions expiring!",
                        "description": "You have subscriptions expiring soon!",
                        "color": 16711680,
                        "fields": fields
                    }
                ]
            })

            # run job to bump expired subs
            bump_expired_subs(expired_subscriptions)

    except Exception as e:
        print("Failed to fetch subscriptions")
        send_discord_webhook_message({
            "username": "Subscriptions",
            "content": "<@288101780074528768>",
            "embeds": [
                {
                    "title": "Something went wrong!",
                    "description": "Check python script! ```" + str(e) + "```",
                    "color": 16711680
                }
            ]
        })

def send_discord_webhook_message(embed):
    requests.post(discord_webhook_url, json=embed, headers=discord_webhook_headers)

def bump_expired_subs(expired_subscriptions):
    for subscription in expired_subscriptions:
        current_expiry_date = dateutil.parser.isoparse(subscription["nextBillingDate"])
        current_expiry_date = current_expiry_date.replace(month=current_expiry_date.month + 1)
        current_expiry_date = current_expiry_date.strftime("%Y-%m-%dT%H:%M:%S.000Z")

        body = {
            "0": {
                "json": {
                    "id": subscription["id"],
                    "nextBillingDate": current_expiry_date
                },
                "meta": {
                    "values": {
                        "nextBillingDate": ["Date"]
                    }
                }
            }
        }

        r = requests.post(f"{url}/api/trpc/subs.update?batch=1", json=body, headers={'content-type': 'application/json'})
        r.raise_for_status()

def main():
    schedule.every().day.do(job)
    # schedule.every(5).seconds.do(job)

    job() # run for cleanup
    while True:
        schedule.run_pending()

main()