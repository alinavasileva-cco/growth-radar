from core.market_segments import classify_okved, normalize_okved


def test_fmcg_segment_from_wholesale_beverages():
    result = classify_okved("46.34.1")
    assert result.segment == "FMCG"


def test_auto_segment():
    result = classify_okved("45.20")
    assert result.segment == "Auto"


def test_it_segment():
    result = classify_okved("62.01")
    assert result.segment == "IT & Telecom"


def test_normalize_okved_from_text():
    assert normalize_okved("ОКВЭД 47.91.2") == "47.91.2"
