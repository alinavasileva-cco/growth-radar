from core.classifier import classify_signal


def test_marketing_hire():
    signal, score, _ = classify_signal("Компания ищет директора по маркетингу")
    assert signal == "marketing_hire"
    assert score == 30


def test_process_problem_has_high_score():
    signal, score, _ = classify_signal("Основатель пишет: не хватает процессов")
    assert signal == "process_problem"
    assert score == 35
