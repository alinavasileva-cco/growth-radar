from typing import Tuple

SIGNALS = {
    "expansion": [
        "открыла новую точку", "открыл новую точку", "открывает филиал",
        "масштабируется", "расширяет сеть", "вышла в новый регион",
        "новое производство", "запустила производство"
    ],
    "funding": [
        "получила инвестиции", "привлекла инвестиции", "получил инвестиции",
        "получила грант", "выиграла грант", "резидент сколково",
        "вошла в акселератор"
    ],
    "marketing_hire": [
        "ищет маркетолога", "ищут маркетолога", "директор по маркетингу",
        "директора по маркетингу", "директор маркетинга", "директора маркетинга",
        "head of marketing", "cmo", "руководитель маркетинга",
        "руководителя маркетинга", "собирает команду маркетинга"
    ],
    "management_hire": [
        "операционный директор", "коммерческий директор", "директор по развитию",
        "руководитель продаж", "coo"
    ],
    "product_launch": [
        "запустила новый продукт", "запустил новый продукт",
        "представила новый продукт", "вывела на рынок", "новая линейка"
    ],
    "process_problem": [
        "не хватает процессов", "хаос в бизнесе", "не успеваем расти",
        "уперлись в потолок", "упёрлись в потолок", "нужна система",
        "масштабирование бизнеса"
    ],
    "franchise": [
        "запустила франшизу", "продает франшизу", "открыла франшизу",
        "франчайзинг", "франшиза"
    ],
}

WEIGHTS = {
    "process_problem": 35,
    "marketing_hire": 30,
    "management_hire": 25,
    "funding": 25,
    "expansion": 25,
    "franchise": 20,
    "product_launch": 15,
    "other": 5,
}


def classify_signal(text: str) -> Tuple[str, int, str]:
    normalized = text.lower()
    matches = []

    for signal_type, phrases in SIGNALS.items():
        found = [phrase for phrase in phrases if phrase in normalized]
        if found:
            matches.append((signal_type, found))

    if not matches:
        return "other", WEIGHTS["other"], "Публичное событие требует ручной проверки."

    matches.sort(key=lambda item: WEIGHTS[item[0]], reverse=True)
    signal_type, phrases = matches[0]
    score = WEIGHTS[signal_type]
    rationale = f"Найден сигнал «{signal_type}»: {', '.join(phrases[:3])}."
    return signal_type, score, rationale
