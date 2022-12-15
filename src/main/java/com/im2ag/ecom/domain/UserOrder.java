package com.im2ag.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.im2ag.ecom.domain.enumeration.OrderState;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserOrder.
 */
@Entity
@Table(name = "user_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "total_price")
    private Float totalPrice;

    @Column(name = "discount")
    private Float discount;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private OrderState state;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "userOrder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "userOrder" }, allowSetters = true)
    private Set<OrderLine> lines = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "cart", "user", "orders", "posts" }, allowSetters = true)
    private AppUser appUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getTotalPrice() {
        return this.totalPrice;
    }

    public UserOrder totalPrice(Float totalPrice) {
        this.setTotalPrice(totalPrice);
        return this;
    }

    public void setTotalPrice(Float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Float getDiscount() {
        return this.discount;
    }

    public UserOrder discount(Float discount) {
        this.setDiscount(discount);
        return this;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public OrderState getState() {
        return this.state;
    }

    public UserOrder state(OrderState state) {
        this.setState(state);
        return this;
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public UserOrder date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<OrderLine> getLines() {
        return this.lines;
    }

    public void setLines(Set<OrderLine> orderLines) {
        if (this.lines != null) {
            this.lines.forEach(i -> i.setUserOrder(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setUserOrder(this));
        }
        this.lines = orderLines;
    }

    public UserOrder lines(Set<OrderLine> orderLines) {
        this.setLines(orderLines);
        return this;
    }

    public UserOrder addLines(OrderLine orderLine) {
        this.lines.add(orderLine);
        orderLine.setUserOrder(this);
        return this;
    }

    public UserOrder removeLines(OrderLine orderLine) {
        this.lines.remove(orderLine);
        orderLine.setUserOrder(null);
        return this;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public UserOrder appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserOrder)) {
            return false;
        }
        return id != null && id.equals(((UserOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserOrder{" +
            "id=" + getId() +
            ", totalPrice=" + getTotalPrice() +
            ", discount=" + getDiscount() +
            ", state='" + getState() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
