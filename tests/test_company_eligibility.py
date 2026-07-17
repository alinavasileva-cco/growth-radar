from core.company_eligibility import classify_company, normalize_company_key


def _profile(**overrides):
    base = {
        "company": "Тестовый бренд",
        "legal_name": 'ООО "ТЕСТОВЫЙ БРЕНД"',
        "inn": "7700000000",
        "okved_main": "62.01",
        "registration_date": "2020-01-01",
        "revenue_latest": "90000000",
        "revenue_previous": "70000000",
        "owner_name": "Иванов Иван Иванович",
        "director_name": "Иванов Иван Иванович",
        "direct_email": "",
        "direct_phone": "",
        "telegram": "",
        "vk_url": "",
        "linkedin_url": "",
    }
    base.update(overrides)
    return base


def test_company_is_not_outreach_ready_without_direct_lpr_contact():
    result = classify_company(_profile())
    assert result["eligible"] is True
    assert result["identity_verified"] is True
    assert result["direct_contact_found"] is False
    assert result["outreach_ready"] is False


def test_company_is_outreach_ready_with_direct_contact():
    result = classify_company(_profile(telegram="https://t.me/owner"))
    assert result["outreach_ready"] is True
    assert result["market_segment"] == "IT & Telecom"


def test_declining_company_is_eligible_above_target_revenue():
    result = classify_company(
        _profile(revenue_latest="466816000", revenue_previous="2196263000")
    )
    assert result["selection_segment"] == "revenue_decline"
    assert result["eligible"] is True


def test_company_name_normalization_removes_legal_form():
    assert normalize_company_key('ООО «Велнесс Фонтейн»') == "велнесс фонтейн"
